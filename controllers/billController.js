const db = require('../db');
const updateOrders = require('../orderUpdater');

exports.getBilling = (req, res) => {
  const uid = req.session.user.id;
  const status = "Paid";

  const getCart = `
    SELECT c.product_id, c.quantity, p.price 
    FROM cart c 
    JOIN products p ON c.product_id = p.product_id 
    WHERE c.user_id = ? LIMIT 3
  `;

  db.query(getCart, [uid], (err, cartItems) => {
    if (err) return res.send("Error fetching cart");
    if (cartItems.length === 0) return res.send("Cart is empty!");

    let p1 = null, q1 = null, p2 = null, q2 = null, p3 = null, q3 = null;
    let total = 0;

    if (cartItems[0]) { p1 = cartItems[0].product_id; q1 = cartItems[0].quantity; total += cartItems[0].price * cartItems[0].quantity; }
    if (cartItems[1]) { p2 = cartItems[1].product_id; q2 = cartItems[1].quantity; total += cartItems[1].price * cartItems[1].quantity; }
    if (cartItems[2]) { p3 = cartItems[2].product_id; q3 = cartItems[2].quantity; total += cartItems[2].price * cartItems[2].quantity; }

    // Apply any discount selected from the cart
    const discountCode = req.session.appliedDiscount || "NONE";
    let finalTotal = total;
    let titem = 0;
    if (q1) titem += q1;
    if (q2) titem += q2;
    if (q3) titem += q3;
    
    if (discountCode === "SCHEME1" && titem >= 3) finalTotal = Math.round(total * 0.95);
    else if (discountCode === "SCHEME2" && total > 2000) finalTotal = Math.round(total * 0.90);
    else if (discountCode === "SCHEME3" && titem >= 5) finalTotal = Math.round(total * 0.85);
    else if (discountCode === "SCHEME4" && total > 5000) finalTotal = Math.round(total * 0.80);
    
    // Clear session discount
    req.session.appliedDiscount = "NONE";

    const insertBill = `
      INSERT INTO bills (user_id, p1, q1, p2, q2, p3, q3, total_amount, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertBill, [uid, p1, q1, p2, q2, p3, q3, finalTotal, status], (err2) => {
      if (err2) return res.send("Error while saving bill");
      db.query("DELETE FROM cart WHERE user_id = ?", [uid], (err3) => {
        if (err3) console.log(err3);
        res.redirect("/my-bills");
      });
    });
  });
};

exports.postCheckoutCod = (req, res) => {
  if (!req.session.user) return res.redirect("/user_login");
  const uid = req.session.user.id;
  const status = "COD (Pending)";
  const order_status = "Order Received";

  const getCart = `
    SELECT c.product_id, c.quantity, p.price 
    FROM cart c 
    JOIN products p ON c.product_id = p.product_id 
    WHERE c.user_id = ? LIMIT 3
  `;

  db.query(getCart, [uid], (err, cartItems) => {
    if (err) return res.send("Error fetching cart");
    if (cartItems.length === 0) return res.redirect("/cart");

    let p1 = null, q1 = null, p2 = null, q2 = null, p3 = null, q3 = null;
    let total = 0;

    if (cartItems[0]) { p1 = cartItems[0].product_id; q1 = cartItems[0].quantity; total += cartItems[0].price * cartItems[0].quantity; }
    if (cartItems[1]) { p2 = cartItems[1].product_id; q2 = cartItems[1].quantity; total += cartItems[1].price * cartItems[1].quantity; }
    if (cartItems[2]) { p3 = cartItems[2].product_id; q3 = cartItems[2].quantity; total += cartItems[2].price * cartItems[2].quantity; }

    const discountCode = req.body.discountCode || "NONE";
    let finalTotal = total;
    let titem = 0;
    if (q1) titem += q1;
    if (q2) titem += q2;
    if (q3) titem += q3;
    
    if (discountCode === "SCHEME1" && titem >= 3) finalTotal = Math.round(total * 0.95);
    else if (discountCode === "SCHEME2" && total > 2000) finalTotal = Math.round(total * 0.90);
    else if (discountCode === "SCHEME3" && titem >= 5) finalTotal = Math.round(total * 0.85);
    else if (discountCode === "SCHEME4" && total > 5000) finalTotal = Math.round(total * 0.80);
    
    const insertBill = `
      INSERT INTO bills (user_id, p1, q1, p2, q2, p3, q3, total_amount, status, order_status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertBill, [uid, p1, q1, p2, q2, p3, q3, finalTotal, status, order_status], (err2) => {
      if (err2) return res.send("Error while saving COD bill");
      db.query("DELETE FROM cart WHERE user_id = ?", [uid], (err3) => {
        if (err3) console.log(err3);
        res.redirect("/my-bills?toast=success&msg=Order+Placed+Successfully");
      });
    });
  });
};

exports.getMyBills = (req, res) => {
  if (!req.session.user) return res.redirect("/user_login");
  const uid = req.session.user.id;
  let cartCount = 0;
  db.query("SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?", [uid], (err, result) => {
    if (err) throw err;
    cartCount = result[0].count || 0;

    const sql = `
      SELECT b.bill_id, b.total_amount, b.status, b.order_status, b.bill_date,
             p1.product_name AS item1, b.q1 AS q1,
             p2.product_name AS item2, b.q2 AS q2,
             p3.product_name AS item3, b.q3 AS q3
      FROM bills b
      LEFT JOIN products p1 ON b.p1 = p1.product_id
      LEFT JOIN products p2 ON b.p2 = p2.product_id
      LEFT JOIN products p3 ON b.p3 = p3.product_id
      WHERE b.user_id = ? ORDER BY b.bill_date DESC
    `;
    
    // Call the serverless-compatible order updater before fetching bills
    updateOrders(() => {
      db.query(sql, [uid], (err, bills) => {
        if (err) return res.send("Error fetching bills");
        res.render("userbilling", { bills, user: req.session.user, cartCount });
      });
    });
  });
};

exports.getAdminBills = (req, res) => {
  const sql = `
    SELECT b.bill_id, b.total_amount, b.status, b.order_status, b.bill_date, u.name AS username,
           p1.product_name AS item1, b.q1 AS q1,
           p2.product_name AS item2, b.q2 AS q2,
           p3.product_name AS item3, b.q3 AS q3
    FROM bills b
    JOIN users u ON b.user_id = u.user_id
    LEFT JOIN products p1 ON b.p1 = p1.product_id
    LEFT JOIN products p2 ON b.p2 = p2.product_id
    LEFT JOIN products p3 ON b.p3 = p3.product_id
    ORDER BY b.bill_date DESC
  `;
  
  // Call the serverless-compatible order updater before fetching bills
  updateOrders(() => {
    db.query(sql, (err, bills) => {
      if (err) return res.send("Error fetching admin bills");
      res.render("adminbillings", { bills });
    });
  });
};

exports.postUpdateBill = (req, res) => {
  const { order_status } = req.body;
  const bill_id = req.params.bill_id;
  db.query("UPDATE bills SET order_status = ? WHERE bill_id = ?", [order_status, bill_id], (err) => {
    if (err) return res.send("Error updating status");
    res.redirect("/admin_bills");
  });
};
