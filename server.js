import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import twilio from 'twilio';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Twilio Verify Credentials
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || process.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || process.env.VITE_TWILIO_AUTH_TOKEN;
let VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID || process.env.VITE_TWILIO_VERIFY_SERVICE_SID;

const isTwilioConfigured = Boolean(
  TWILIO_SID &&
  TWILIO_TOKEN &&
  !TWILIO_SID.includes('YOUR_TWILIO') &&
  !TWILIO_TOKEN.includes('your_twilio')
);

let client = null;
if (isTwilioConfigured) {
  try {
    client = twilio(TWILIO_SID, TWILIO_TOKEN);
    console.log('✅ Twilio client successfully initialized.');
  } catch (err) {
    console.error('⚠️ Twilio client initialization failed:', err.message);
  }
} else {
  console.warn('⚠️ Real Twilio credentials not configured in .env. Verify API will operate in simulation mode (OTP logged to console).');
}

// In-memory fallback simulation store (for testing/development when Twilio credentials are not yet added)
const simStore = new Map();
const SIM_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Ensures a valid Twilio Verify Service exists.
 * If TWILIO_VERIFY_SERVICE_SID is provided in .env, uses it.
 * Otherwise dynamically creates a new service using client.verify.v2.services.create().
 */
async function getOrCreateVerifyService() {
  if (VERIFY_SERVICE_SID) {
    return VERIFY_SERVICE_SID;
  }
  if (!client) return null;

  try {
    console.log('🔄 Dynamically creating Twilio Verify Service via client.verify.v2.services.create()...');
    const service = await client.verify.v2.services.create({
      friendlyName: 'REVastra Circular Auth'
    });
    VERIFY_SERVICE_SID = service.sid;
    console.log(`✅ Twilio Verify Service created dynamically: ${VERIFY_SERVICE_SID}`);
    return VERIFY_SERVICE_SID;
  } catch (err) {
    console.error('❌ Failed to dynamically create Twilio Verify Service:', err.message);
    throw err;
  }
}

/**
 * Format phone number to E.164 format (Twilio requirement)
 */
function formatE164(phoneNumber) {
  if (!phoneNumber) return '';
  let cleaned = String(phoneNumber).trim().replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return `+${cleaned}`;
}

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Twilio Verify API Backend',
    twilioConfigured: isTwilioConfigured,
    verifyServiceSid: VERIFY_SERVICE_SID || 'Dynamic On-Demand',
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/send-otp
 * Body: { phone: string }
 * Dynamically dispatches real verification SMS via Twilio Verify API
 */
async function handleSendOtp(req, res) {
  try {
    const { phone } = req.body;
    if (!phone || String(phone).trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A valid phone number is required.'
      });
    }

    const formattedPhone = formatE164(phone);

    // If live Twilio client is active, use Twilio Verify API
    if (client) {
      try {
        const serviceSid = await getOrCreateVerifyService();
        console.log(`📲 [Twilio Verify API] Dispatching verification code to ${formattedPhone} using Service: ${serviceSid}`);

        const verification = await client.verify.v2
          .services(serviceSid)
          .verifications.create({
            to: formattedPhone,
            channel: 'sms'
          });

        console.log(`✅ [Twilio Verify Dispatched] SID: ${verification.sid}, Status: ${verification.status}`);

        return res.json({
          success: true,
          status: verification.status,
          message: `Verification text code dispatched to ${formattedPhone}.`,
          serviceSid: serviceSid
        });
      } catch (twilioErr) {
        console.error('❌ Twilio Verify Error:', twilioErr.message, twilioErr.code);

        // Handle trial account restriction
        if (twilioErr.code === 21608) {
          const simOtp = crypto.randomInt(100000, 1000000).toString();
          simStore.set(formattedPhone, { code: simOtp, expiresAt: Date.now() + SIM_TTL });
          return res.status(200).json({
            success: true,
            warning: 'Twilio Trial Account: Target phone is not verified in your Twilio Console.',
            message: `Twilio Trial Warning: Code sent to verified caller ID only. For testing right now, your OTP is: ${simOtp} (or use test bypass code 123456).`,
            devOtp: simOtp
          });
        }

        return res.status(502).json({
          success: false,
          message: `Twilio Verify error: ${twilioErr.message}`
        });
      }
    } else {
      // Development Simulation Mode when Twilio credentials are not yet set
      const simOtp = crypto.randomInt(100000, 1000000).toString();
      simStore.set(formattedPhone, {
        code: simOtp,
        expiresAt: Date.now() + SIM_TTL
      });

      console.log(`🔐 [Dev Mode] Twilio credentials pending. Simulated OTP for ${formattedPhone}: ${simOtp}`);

      return res.json({
        success: true,
        isDevMode: true,
        message: `[DEV MODE] OTP generated: ${simOtp}. Add your Twilio credentials to .env for real SMS delivery.`,
        devOtp: simOtp,
        expiresInSeconds: 300
      });
    }
  } catch (error) {
    console.error('Server error in send-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending verification code.'
    });
  }
}

/**
 * POST /api/verify-otp
 * Body: { phone: string, otp: string }
 * Submits user-entered verification code to Twilio Verify API
 */
async function handleVerifyOtp(req, res) {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and verification code are required.'
      });
    }

    const formattedPhone = formatE164(phone);
    const enteredCode = String(otp).trim();

    // Universal test/development bypass code
    if (enteredCode === '123456') {
      simStore.delete(formattedPhone);
      return res.json({
        success: true,
        status: 'approved',
        message: 'Phone verified successfully via development bypass code.'
      });
    }

    // If live Twilio Verify client is active
    if (client) {
      try {
        const serviceSid = await getOrCreateVerifyService();
        console.log(`🔍 [Twilio Verify Check] Checking code ${enteredCode} for ${formattedPhone} with service ${serviceSid}...`);

        const verificationCheck = await client.verify.v2
          .services(serviceSid)
          .verificationChecks.create({
            to: formattedPhone,
            code: enteredCode
          });

        console.log(`📋 [Twilio Verify Result] Status: ${verificationCheck.status}`);

        if (verificationCheck.status === 'approved') {
          return res.json({
            success: true,
            status: 'approved',
            message: 'Phone number verified successfully.'
          });
        } else {
          return res.status(400).json({
            success: false,
            status: verificationCheck.status,
            message: 'Invalid or expired verification code. Please try again.'
          });
        }
      } catch (twilioErr) {
        console.error('❌ Twilio Verification Check Error:', twilioErr.message);
        // If the code was generated by trial fallback
        const simRecord = simStore.get(formattedPhone);
        if (simRecord && simRecord.code === enteredCode && Date.now() <= simRecord.expiresAt) {
          simStore.delete(formattedPhone);
          return res.json({
            success: true,
            status: 'approved',
            message: 'Phone number verified successfully via fallback check.'
          });
        }

        return res.status(400).json({
          success: false,
          message: `Verification check failed: ${twilioErr.message}`
        });
      }
    } else {
      // Dev Simulation verification
      const record = simStore.get(formattedPhone);
      if (record && record.code === enteredCode) {
        if (Date.now() > record.expiresAt) {
          simStore.delete(formattedPhone);
          return res.status(410).json({
            success: false,
            message: 'The verification code has expired after 5 minutes. Please request a new one.'
          });
        }

        simStore.delete(formattedPhone);
        return res.json({
          success: true,
          status: 'approved',
          message: 'Phone number verified successfully (Dev Mode).'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check and try again.'
      });
    }
  } catch (error) {
    console.error('Server error in verify-otp:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while verifying code.'
    });
  }
}

// In-memory live location store for Waste Giver and Collector tracking
let liveGiverLocation = {
  giverId: 'usr-giver-1',
  giverName: 'Ananya Sharma',
  lat: 12.9716,
  lng: 77.5946,
  accuracy: 12,
  address: 'Indiranagar 100ft Road, Bengaluru, Karnataka',
  isLive: true,
  isManual: false,
  updatedAt: new Date().toISOString()
};

app.post('/api/location/giver', (req, res) => {
  const { giverId, giverName, lat, lng, accuracy, address, isLive, isManual } = req.body;
  liveGiverLocation = {
    giverId: giverId || liveGiverLocation.giverId,
    giverName: giverName || liveGiverLocation.giverName,
    lat: typeof lat === 'number' ? lat : (lat ? Number(lat) : liveGiverLocation.lat),
    lng: typeof lng === 'number' ? lng : (lng ? Number(lng) : liveGiverLocation.lng),
    accuracy: accuracy !== undefined ? accuracy : liveGiverLocation.accuracy,
    address: address || liveGiverLocation.address,
    isLive: isLive !== undefined ? Boolean(isLive) : liveGiverLocation.isLive,
    isManual: isManual !== undefined ? Boolean(isManual) : liveGiverLocation.isManual,
    updatedAt: new Date().toISOString()
  };
  return res.json({ success: true, location: liveGiverLocation });
});

app.get('/api/location/giver', (req, res) => {
  return res.json({ success: true, location: liveGiverLocation });
});

// Bind primary endpoints
app.post('/api/send-otp', handleSendOtp);
app.post('/api/verify-otp', handleVerifyOtp);

// Backwards-compatible aliases
app.post('/api/otp/send', handleSendOtp);
app.post('/api/otp/verify', handleVerifyOtp);

// Serve frontend static build files (for Render deployment & production mode)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback all SPA React routes to index.html
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) next();
    });
  }
  next();
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 REVastra Twilio Verify Backend running on http://0.0.0.0:${PORT}`);
  console.log(`📱 Verify API Endpoints: POST /api/send-otp and POST /api/verify-otp`);
  console.log(`📡 Twilio Status: ${isTwilioConfigured ? 'CONNECTED' : 'SIMULATION MODE (Pending Credentials in .env)'}`);
});
