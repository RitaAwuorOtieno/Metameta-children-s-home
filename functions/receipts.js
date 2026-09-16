const admin = require('firebase-admin');

// Generate receipt data after successful payment
async function generateReceipt(transactionData) {
  const db = admin.database();
  
  const receipt = {
    receiptNumber: `MM-${Date.now()}`,
    donorName: transactionData.donorName || 'Anonymous',
    donorEmail: transactionData.donorEmail,
    amount: transactionData.amount,
    currency: 'KES',
    paymentMethod: transactionData.method || 'M-Pesa',
    transactionId: transactionData.transactionId,
    date: new Date().toISOString(),
    status: 'completed',
    purpose: transactionData.purpose || 'General Donation'
  };
  
  // Save receipt to database
  const receiptRef = db.ref('receipts').push();
  await receiptRef.set(receipt);
  
  // Return receipt for email sending
  return {
    id: receiptRef.key,
    ...receipt
  };
}

// Format receipt as HTML for email
function formatReceiptHTML(receipt) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #e63946, #c1121f); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Metameta Children's Home</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Payment Receipt</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border: 1px solid #e9ecef;">
        <h2 style="color: #1a1a2e;">Thank you for your donation! 💙</h2>
        
        <div style="background: white; border-radius: 10px; padding: 20px; margin-top: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #6c757d;">Receipt Number:</td>
              <td style="padding: 10px 0; font-weight: bold;">${receipt.receiptNumber}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6c757d;">Donor Name:</td>
              <td style="padding: 10px 0; font-weight: bold;">${receipt.donorName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6c757d;">Amount:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #e63946;">KES ${receipt.amount}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6c757d;">Date:</td>
              <td style="padding: 10px 0;">${new Date(receipt.date).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6c757d;">Transaction ID:</td>
              <td style="padding: 10px 0; font-family: monospace;">${receipt.transactionId}</td>
            </tr>
          </table>
        </div>
        
        <p style="margin-top: 20px; color: #6c757d; font-size: 14px;">
          This receipt serves as official confirmation of your donation. 
          Thank you for supporting our children!
        </p>
      </div>
      
      <div style="background: #1a1a2e; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 0;">
          © 2026 Metameta Children's Home | Nairobi, Kenya
        </p>
      </div>
    </div>
  `;
}

module.exports = { generateReceipt, formatReceiptHTML };