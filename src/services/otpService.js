// OTP Service for handling Mobile and Email verifications
const API_KEY = import.meta.env.VITE_OTP_API_KEY;

/**
 * Simulates sending an OTP to a mobile number.
 * Replace the fetch block with the actual OTP provider's endpoint (e.g., Fast2SMS, Twilio).
 */
export async function sendMobileOTP(phoneNumber) {
  console.log(`[OTP Service] Sending SMS OTP to ${phoneNumber} using API Key: ${API_KEY}`);
  
  // Simulated Network Request
  return new Promise((resolve) => {
    setTimeout(() => {
      // Show an alert so the user "receives" the OTP on their screen
      if (typeof window !== 'undefined') {
        window.alert(`[TEST SMS to ${phoneNumber}]\n\nYour REVastra Mobile OTP is: 123456`);
      }
      resolve({ success: true, message: 'OTP Sent successfully. (Check your screen alerts)' });
    }, 1500);
  });
}

/**
 * Simulates sending an OTP to an email address.
 * Replace the fetch block with the actual Email provider's endpoint (e.g., SendGrid, Resend).
 */
export async function sendEmailOTP(emailAddress) {
  console.log(`[OTP Service] Sending Email OTP to ${emailAddress} using API Key: ${API_KEY}`);
  
  // Simulated Network Request
  return new Promise((resolve) => {
    setTimeout(() => {
      // Show an alert so the user "receives" the OTP on their screen
      if (typeof window !== 'undefined') {
        window.alert(`[TEST EMAIL to ${emailAddress}]\n\nYour REVastra Email OTP is: 123456`);
      }
      resolve({ success: true, message: 'OTP Sent successfully. (Check your screen alerts)' });
    }, 1500);
  });
}

/**
 * Verifies the OTP entered by the user.
 */
export async function verifyOTP(code) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (code === '123456') {
        resolve({ success: true });
      } else {
        resolve({ success: false, message: 'Invalid OTP code. Please try again.' });
      }
    }, 800);
  });
}
