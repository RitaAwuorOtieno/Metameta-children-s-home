const admin = require('firebase-admin');
const { initiateSTKPush } = require('./mpesa');

// Check for due recurring donations (run daily via Cloud Scheduler)
async function processRecurringDonations() {
  const db = admin.database();
  const now = Date.now();
  
  // Get all active recurring donations that are due
  const snapshot = await db.ref('recurring_donations')
    .orderByChild('nextPaymentDate')
    .endAt(now)
    .once('value');
  
  const dueDonations = snapshot.val();
  if (!dueDonations) return;
  
  for (const [id, donation] of Object.entries(dueDonations)) {
    try {
      // Initiate payment
      const result = await initiateSTKPush(
        donation.phone,
        donation.amount,
        `REC-${id}`,
        `Recurring donation for ${donation.name}`
      );
      
      // Update next payment date (30 days later)
      const nextDate = now + (30 * 24 * 60 * 60 * 1000);
      
      await db.ref(`recurring_donations/${id}`).update({
        lastPaymentDate: now,
        nextPaymentDate: nextDate,
        lastCheckoutRequestId: result.CheckoutRequestID,
        status: 'pending'
      });
      
      console.log(`Recurring donation initiated for ${donation.phone}`);
      
    } catch (error) {
      console.error(`Failed for ${id}:`, error.message);
      
      // Mark as failed
      await db.ref(`recurring_donations/${id}/failures`).push({
        date: now,
        error: error.message
      });
    }
  }
}

module.exports = { processRecurringDonations };