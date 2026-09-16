const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { initiateSTKPush } = require('./mpesa');
const { generateReceipt } = require('./receipts');
const { processRecurringDonations } = require('./recurring');
const { submitOrder } = require('./pesapal');

admin.initializeApp();
const db = admin.database();

// ================= M-PESA STK PUSH =================
exports.mpesaSTKPush = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }
  
  try {
    const { phone, amount, email, name } = req.body;
    
    if (!phone || !amount) {
      return res.status(400).json({ error: 'Phone and amount required' });
    }
    
    let formattedPhone = phone.replace(/\s/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }
    
    const result = await initiateSTKPush(
      formattedPhone,
      amount,
      `MM-${Date.now()}`,
      'Donation to Metameta'
    );
    
    const donationRef = db.ref('donations').push();
    await donationRef.set({
      phone: formattedPhone,
      amount: amount,
      email: email || null,
      name: name || 'Anonymous',
      checkoutRequestId: result.CheckoutRequestID,
      merchantRequestId: result.MerchantRequestID,
      status: 'pending',
      date: new Date().toISOString(),
      method: 'M-Pesa'
    });
    
    res.json({
      success: true,
      message: 'STK Push sent. Please enter your M-Pesa PIN.',
      checkoutRequestId: result.CheckoutRequestID
    });
    
  } catch (error) {
    console.error('STK Push error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Payment initiation failed',
      details: error.response?.data?.errorMessage || error.message
    });
  }
});

// ================= M-PESA CALLBACK =================
exports.mpesaCallback = functions.https.onRequest(async (req, res) => {
  try {
    const callbackData = req.body.Body.stkCallback;
    const checkoutRequestId = callbackData.CheckoutRequestID;
    
    const snapshot = await db.ref('donations')
      .orderByChild('checkoutRequestId')
      .equalTo(checkoutRequestId)
      .once('value');
    
    if (!snapshot.exists()) {
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }
    
    const donationId = Object.keys(snapshot.val())[0];
    const donation = snapshot.val()[donationId];
    
    if (callbackData.ResultCode === 0) {
      const callbackMetadata = callbackData.CallbackMetadata.Item;
      const transactionId = callbackMetadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value;
      
      const receipt = await generateReceipt({
        donorName: donation.name,
        donorEmail: donation.email,
        amount: donation.amount,
        transactionId: transactionId,
        purpose: 'Donation to Metameta Children\'s Home'
      });
      
      await db.ref(`donations/${donationId}`).update({
        status: 'completed',
        transactionId: transactionId,
        receiptId: receipt.id,
        completedAt: new Date().toISOString()
      });
    } else {
      await db.ref(`donations/${donationId}`).update({
        status: 'failed',
        failureReason: callbackData.ResultDesc,
        failedAt: new Date().toISOString()
      });
    }
    
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    
  } catch (error) {
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
});