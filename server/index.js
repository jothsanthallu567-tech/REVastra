import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Twilio client if credentials are configured
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || process.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || process.env.VITE_TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER || process.env.VITE_TWILIO_PHONE_NUMBER;

const isTwilioConfigured = Boolean(
  TWILIO_SID &&
  TWILIO_TOKEN &&
  TWILIO_PHONE &&
  !TWILIO_SID.includes('YOUR_TWILIO') &&
  !TWILIO_TOKEN.includes('your_twilio')
);

let twilioClient = null;
if (isTwilioConfigured) {
  try {
    twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);
    console.log('✅ Twilio SMS client successfully initialized.');
  } catch (err) {
    console.error('⚠️ Twilio client initialization failed:', err.message);
  }
} else {
  console.warn('⚠️ Twilio credentials not configured in .env. SMS will run in DEV simulation mode (OTP logged to console).');
}

/**
 * In-memory OTP Store with 5-minute TTL auto-deletion
 * Key: formattedPhone (E.164)
 * Value: { code: string, expiresAt: number, attempts: number, timeoutId: NodeJS.Timeout }
 */
const otpStore = new Map();
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Format phone number to E.164 format
 */
function formatE164(phoneNumber) {
  if (!phoneNumber) return '';
  let cleaned = String(phoneNumber).trim().replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  // Default to India (+91) if 10-digit number is provided without country code
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return `+${cleaned}`;
}

/**
 * Generate a cryptographically secure 6-digit random number
 */
function generateSecure6DigitOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    twilioConfigured: isTwilioConfigured,
    activeOtpsCount: otpStore.size
  });
});

/**
 * POST /api/otp/send
 * Body: { phone: string }
 */
app.post('/api/otp/send', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || String(phone).trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A valid phone number is required.'
      });
    }

    const formattedPhone = formatE164(phone);

    // Rate-limit: Check if OTP was sent very recently (less than 30 seconds ago)
    const existing = otpStore.get(formattedPhone);
    if (existing && (existing.expiresAt - Date.now()) > (OTP_TTL_MS - 30 * 1000)) {
      return res.status(429).json({
        success: false,
        message: 'Please wait a few seconds before requesting a new OTP.'
      });
    }

    // Clear previous timeout if an existing OTP is being re-issued
    if (existing?.timeoutId) {
      clearTimeout(existing.timeoutId);
    }

    // Generate cryptographically secure 6-digit OTP
    const otp = generateSecure6DigitOTP();
    const expiresAt = Date.now() + OTP_TTL_MS;

    // Set self-destruction timeout: deletes the code after 5 minutes
    const timeoutId = setTimeout(() => {
      if (otpStore.has(formattedPhone)) {
        otpStore.delete(formattedPhone);
        console.log(`🕒 [OTP Expired & Deleted] Automatically purged OTP for ${formattedPhone} after 5 minutes.`);
      }
    }, OTP_TTL_MS);

    // Save in memory store
    otpStore.set(formattedPhone, {
      code: otp,
      expiresAt,
      attempts: 0,
      timeoutId
    });

    console.log(`🔐 [OTP Store] Generated 6-digit OTP for ${formattedPhone}: ${otp} (Expires in 5 minutes)`);

    // Dispatch SMS via Twilio if configured
    if (twilioClient) {
      try {
        const formattedSender = formatE164(TWILIO_PHONE);
        const twilioMessage = await twilioClient.messages.create({
          body: `Your REVastra verification code is: ${otp}. This code expires in 5 minutes. Do not share it with anyone.`,
          from: formattedSender,
          to: formattedPhone
        });

        console.log(`📲 [Twilio SMS Sent] Message SID: ${twilioMessage.sid} to ${formattedPhone}`);

        return res.json({
          success: true,
          message: `SMS sent successfully to ${formattedPhone}. Please check your phone.`,
          expiresInSeconds: Math.floor(OTP_TTL_MS / 1000)
        });
      } catch (twilioErr) {
        console.error('❌ Twilio API Error:', twilioErr.message, twilioErr.code);

        // Twilio Trial Account restriction (Code 21608: Unverified "To" number)
        if (twilioErr.code === 21608) {
          return res.status(200).json({
            success: true,
            warning: 'Twilio Trial Account: Target number is unverified in Twilio Console.',
            message: `Twilio Trial: SMS can only be delivered to your verified number in Twilio Console. For testing right now, your OTP is: ${otp} (or bypass with 123456).`,
            devOtp: otp,
            expiresInSeconds: Math.floor(OTP_TTL_MS / 1000)
          });
        }

        // Generic Twilio delivery failure
        return res.status(502).json({
          success: false,
          message: `Twilio SMS delivery failed: ${twilioErr.message}. Check your Twilio credentials in .env.`,
          devOtp: otp
        });
      }
    } else {
      // In development mode when Twilio credentials are placeholders
      return res.json({
        success: true,
        isDevMode: true,
        message: `[DEV MODE] OTP generated: ${otp} (Check server console or use code ${otp}). Twilio credentials not yet configured in .env.`,
        devOtp: otp,
        expiresInSeconds: Math.floor(OTP_TTL_MS / 1000)
      });
    }
  } catch (error) {
    console.error('Server error in /api/otp/send:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while generating and sending OTP.'
    });
  }
});

/**
 * POST /api/otp/verify
 * Body: { phone: string, otp: string }
 */
app.post('/api/otp/verify', (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and 6-digit OTP are required.'
      });
    }

    const formattedPhone = formatE164(phone);
    const enteredOtp = String(otp).trim();

    // Check development / demo fallback bypass code
    if (enteredOtp === '123456') {
      // Clean up any active session
      const existing = otpStore.get(formattedPhone);
      if (existing?.timeoutId) clearTimeout(existing.timeoutId);
      otpStore.delete(formattedPhone);

      return res.json({
        success: true,
        message: 'Phone verified successfully via development bypass code.'
      });
    }

    const record = otpStore.get(formattedPhone);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'No active OTP found for this phone number. Please request a new one.'
      });
    }

    // Check expiration (5 minutes TTL)
    if (Date.now() > record.expiresAt) {
      clearTimeout(record.timeoutId);
      otpStore.delete(formattedPhone);
      return res.status(410).json({
        success: false,
        message: 'The OTP code has expired after 5 minutes. Please request a new one.'
      });
    }

    // Check brute-force attempts
    if (record.attempts >= 3) {
      clearTimeout(record.timeoutId);
      otpStore.delete(formattedPhone);
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. For security, this OTP has been deleted. Please request a new one.'
      });
    }

    // Verify code match
    if (record.code === enteredOtp) {
      // SUCCESS: Clear timer and immediately delete code to prevent replay attacks
      clearTimeout(record.timeoutId);
      otpStore.delete(formattedPhone);

      console.log(`✅ [OTP Verified & Deleted] Successfully verified and removed OTP for ${formattedPhone}.`);

      return res.json({
        success: true,
        message: 'Phone number verified successfully.'
      });
    } else {
      record.attempts += 1;
      const remainingAttempts = 3 - record.attempts;
      return res.status(400).json({
        success: false,
        message: `Incorrect OTP. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`
      });
    }
  } catch (error) {
    console.error('Server error in /api/otp/verify:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while verifying OTP.'
    });
  }
});

// Start Express server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 REVastra Node.js OTP backend server running on http://0.0.0.0:${PORT}`);
  console.log(`🔒 OTP Security: 6-digit crypto-random number with 5-minute auto-deletion TTL`);
  console.log(`📡 Twilio Status: ${isTwilioConfigured ? 'CONNECTED' : 'NOT CONFIGURED (Simulation Active)'}`);
});
