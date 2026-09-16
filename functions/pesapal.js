const axios = require('axios');

// Get Pesapal access token
async function getPesapalToken() {
  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
  
  const url = process.env.PESAPAL_ENVIRONMENT === 'sandbox'
    ? 'https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken'
    : 'https://pay.pesapal.com/pesapalv3/api/Auth/RequestToken';
  
  const response = await axios.post(url, {
    consumer_key: consumerKey,
    consumer_secret: consumerSecret
  });
  
  return response.data.token;
}

// Register IPN URL with Pesapal
async function registerIPN(ipnUrl) {
  const token = await getPesapalToken();
  
  const url = process.env.PESAPAL_ENVIRONMENT === 'sandbox'
    ? 'https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN'
    : 'https://pay.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN';
  
  const response = await axios.post(url, {
    url: ipnUrl,
    ipn_notification_type: 'POST'
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data.ipn_id;
}

// Submit order to Pesapal
async function submitOrder(orderData) {
  const token = await getPesapalToken();
  
  const url = process.env.PESAPAL_ENVIRONMENT === 'sandbox'
    ? 'https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest'
    : 'https://pay.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest';
  
  const payload = {
    id: orderData.reference,
    currency: orderData.currency || 'KES',
    amount: orderData.amount,
    description: orderData.description,
    callback_url: orderData.callbackUrl,
    notification_id: process.env.PESAPAL_IPN_ID,
    billing_address: {
      email_address: orderData.email,
      first_name: orderData.firstName || '',
      last_name: orderData.lastName || '',
      phone_number: orderData.phone || ''
    }
  };
  
  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
}

// Query payment status
async function getTransactionStatus(orderTrackingId) {
  const token = await getPesapalToken();
  
  const url = process.env.PESAPAL_ENVIRONMENT === 'sandbox'
    ? `https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`
    : `https://pay.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`;
  
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return response.data;
}

module.exports = { getPesapalToken, registerIPN, submitOrder, getTransactionStatus };