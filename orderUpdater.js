const db = require('./db');

/**
 * Lazy evaluation function to update order statuses.
 * Instead of running in a background interval, this should be called
 * when a user fetches their bills.
 */
function updateOrders(callback) {
  const sql = `SELECT bill_id, order_status, bill_date FROM bills WHERE order_status != 'Delivered'`;
  db.query(sql, (err, bills) => {
    if (err) {
      if (callback) callback(err);
      return;
    }

    if (bills.length === 0) {
      if (callback) callback(null);
      return;
    }

    let pendingUpdates = 0;
    
    bills.forEach(bill => {
      const timeDiffMinutes = (new Date() - new Date(bill.bill_date)) / (1000 * 60);

      let nextStatus = null;

      if (bill.order_status === 'Order Received') {
        const randomThreshold = Math.floor(Math.random() * 4) + 2; 
        if (timeDiffMinutes >= randomThreshold) {
          nextStatus = 'Baking in Progress';
        }
      } else if (bill.order_status === 'Baking in Progress') {
        const randomThreshold = Math.floor(Math.random() * 6) + 5;
        if (timeDiffMinutes >= randomThreshold) {
          nextStatus = 'Out for Delivery';
        }
      }

      if (nextStatus) {
        pendingUpdates++;
        db.query('UPDATE bills SET order_status = ? WHERE bill_id = ?', [nextStatus, bill.bill_id], (err2) => {
          pendingUpdates--;
          if (err2) console.error("Error auto-updating order status:", err2);
          else console.log(`[Auto-Updater] Order #${bill.bill_id} status changed to '${nextStatus}'`);
          
          // Trigger callback when all asynchronous updates are completed
          if (pendingUpdates === 0 && callback) callback(null);
        });
      }
    });

    // If no updates were triggered, fire callback immediately
    if (pendingUpdates === 0 && callback) callback(null);
  });
}

module.exports = updateOrders;
