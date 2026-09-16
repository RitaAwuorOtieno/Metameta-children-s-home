const axios = require('axios');

// Get access token from Safaricom
async function getAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  
  const url = process.env.MPESA_ENVIRONMENT === 'sandbox'
    ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
    : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
  
  const response = await axios.get(url, {
    headers: {
      Authorization: `Basic ${auth}`
    }
  });
  
  return response.data.access_token;
}

// Generate password for STK Push
function generatePassword() {
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const timestamp = getTimestamp();
  
  const str = shortcode + passkey + timestamp;
  return Buffer.from(str).toString('base64');
}

// Generate timestamp in format YYYYMMDDHHmmss
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Initiate STK Push
async function initiateSTKPush(phone, amount, accountReference, description) {
  const accessToken = await getAccessToken();
  const timestamp = getTimestamp();
  const password = generatePassword();
  
  const url = process.env.MPESA_ENVIRONMENT === 'sandbox'
    ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
    : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
  
  const data = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: 'https://us-central1-metameta-82db5.cloudfunctions.net/mpesaCallback',
    AccountReference: accountReference,
    TransactionDesc: description
  };
  
  const response = await axios.post(url, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  
  return response.data;
}

module.exports = { initiateSTKPush, getAccessToken };