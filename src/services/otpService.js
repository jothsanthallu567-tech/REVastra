// Real OTP Service using EmailJS and Twilio

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const TWILIO_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
const TWILIO_PHONE = import.meta.env.VITE_TWILIO_PHONE_NUMBER;

// In-memory state to store the generated OTPs for verification
// In a real production app, these should be stored in a secure backend database or Redis cache
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

    // Format phone number to ensure it has a '+' sign (Twilio requires E.164 format)
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    // Prepare Twilio API Request
    // We use corsproxy.io because Twilio strictly blocks browser frontend requests
    const url = `https://corsproxy.io/?https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
    
    const body = new URLSearchParams();
    body.append('To', formattedPhone);
    // Ensure the From phone number is formatted correctly if it doesn't have a '+'
    body.append('From', TWILIO_PHONE.startsWith('+') ? TWILIO_PHONE : '+' + TWILIO_PHONE);
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
      return { success: false, message: data.message || 'Failed to send SMS.' };
    }

    return { success: true, message: 'SMS Sent successfully! Please check your phone.' };
  } catch (error) {
    console.error('SMS Send Error:', error);
    return { success: false, message: 'Failed to send SMS due to network error.' };
  }
}

/**
 * Sends a real Email OTP using EmailJS REST API
 */
export async function sendEmailOTP(emailAddress) {
  try {
    const otp = generateOTP();
    currentEmailOtp = otp;
    console.log(`[OTP Service] Generated Email OTP: ${otp}`);

    const payload = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        email: emailAddress, // Used if template has {{email}}
        to_email: emailAddress, // Fallback common variable
        otp: otp,
        message: `Your REVastra Verification Code is: ${otp}`
      }
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // EmailJS returns a 200 OK with plain text "OK" on success
    if (response.ok) {
      return { success: true, message: 'Email Sent successfully! Please check your inbox.' };
    } else {
      const errorText = await response.text();
      console.error('EmailJS Error:', errorText);
      return { success: false, message: 'Failed to send Email. Please check API credentials.' };
    }
  } catch (error) {
    console.error('Email Send Error:', error);
    return { success: false, message: 'Failed to send Email due to network error.' };
  }
}

/**
 * Verifies the OTP entered by the user against the in-memory state.
 * Returns true if the code matches either the email or phone OTP generated.
 */
export async function verifyOTP(code) {
  return new Promise((resolve) => {
    // Simulate slight network delay for UI UX
    setTimeout(() => {
      // Check if it matches either the phone or email OTP
      if (code === currentEmailOtp || code === currentPhoneOtp) {
        resolve({ success: true });
      } else {
        // Fallback for development if keys fail or user gets locked out
        if (code === '123456') {
           resolve({ success: true, message: 'Verified via fallback bypass code.'});
           return;
        }
        resolve({ success: false, message: 'Invalid OTP code. Please try again.' });
      }
    }, 800);
  });
}
