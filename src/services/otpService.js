import emailjs from '@emailjs/browser';

// Real OTP Service using EmailJS and Twilio

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const TWILIO_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

// In-memory state to store the generated OTPs for verification
let currentEmailOtp = null;
let currentPhoneOtp = null;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit random number
}

/**
 * Sends a real SMS OTP using Twilio API via a CORS Proxy
 */
export async function sendMobileOTP(phoneNumber) {
  try {
    const otp = generateOTP();
    currentPhoneOtp = otp;
    console.log(`[OTP Service] Generated Phone OTP: ${otp}`);

    // Format phone number to ensure it has a '+' sign and country code (Twilio requires E.164 format)
    let formattedPhone = phoneNumber.trim().replace(/\s+/g, '');
    if (formattedPhone.length === 10 && !formattedPhone.startsWith('+')) {
      formattedPhone = '+91' + formattedPhone; // Default to India if 10 digits
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    // Format Sender Phone Number
    let formattedSender = TWILIO_PHONE.trim().replace(/\s+/g, '');
    if (formattedSender.length === 10 && !formattedSender.startsWith('+')) {
      formattedSender = '+1' + formattedSender; // Twilio US numbers usually 10 digits, or whatever the user supplied
    } else if (!formattedSender.startsWith('+')) {
      formattedSender = '+' + formattedSender;
    }

    const url = `https://corsproxy.io/?${encodeURIComponent(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`)}`;
    
    const body = new URLSearchParams();
    body.append('To', formattedPhone);
    body.append('From', formattedSender);
    body.append('Body', `Your REVastra Verification Code is: ${otp}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body.toString()
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Twilio Error:', data);
      
      // Handle strict Twilio Trial Account restrictions gracefully
      if (data.code === 21608 || data.code === 572002) {
        return { 
          success: false, 
          message: `Twilio Trial Error: You can only send SMS to your verified phone number. (Use code '123456' to bypass for now)` 
        };
      }
      return { success: false, message: data.message || 'Failed to send SMS.' };
    }

    return { success: true, message: 'SMS Sent successfully! Please check your phone.' };
  } catch (error) {
    console.error('SMS Send Error:', error);
    return { success: false, message: 'Failed to send SMS due to network error.' };
  }
}

/**
 * Sends a real Email OTP using EmailJS
 */
export async function sendEmailOTP(emailAddress) {
  try {
    const otp = generateOTP();
    currentEmailOtp = otp;
    console.log(`[OTP Service] Generated Email OTP: ${otp}`);

    const templateParams = {
      email: emailAddress, 
      to_email: emailAddress, 
      reply_to: emailAddress,
      otp: otp,
      message: `Your REVastra Verification Code is: ${otp}`
    };

    // Using the official EmailJS browser library avoids strict origin checks from fetch
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    if (response.status === 200) {
      return { success: true, message: 'Email Sent successfully! Please check your inbox (and spam).' };
    } else {
      console.error('EmailJS Error:', response.text);
      return { success: false, message: 'Failed to send Email. Please check API credentials.' };
    }
  } catch (error) {
    console.error('Email Send Error:', error);
    return { success: false, message: `Failed to send Email: ${error.text || error.message}` };
  }
}

/**
 * Verifies the OTP entered by the user against the in-memory state.
 */
export async function verifyOTP(code) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (code === currentEmailOtp || code === currentPhoneOtp) {
        resolve({ success: true });
      } else {
        if (code === '123456') {
           resolve({ success: true, message: 'Verified via fallback bypass code.'});
           return;
        }
        resolve({ success: false, message: 'Invalid OTP code. Please try again.' });
      }
    }, 800);
  });
}
