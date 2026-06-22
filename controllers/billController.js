const db = require('../db');

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

    const insertBill = `
      INSERT INTO bills (user_id, p1, q1, p2, q2, p3, q3, total_amount, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(insertBill, [uid, p1, q1, p2, q2, p3, q3, total, status], (err2) => {
      if (err2) return res.send("Error while saving bill");
      db.query("DELETE FROM cart WHERE user_id = ?", [uid], (err3) => {
        if (err3) console.log(err3);
        res.redirect("/cart");
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
      SELECT b.bill_id, b.total_amount, b.status, b.bill_date,
             p1.product_name AS item1, b.q1 AS q1,
             p2.product_name AS item2, b.q2 AS q2,
             p3.product_name AS item3, b.q3 AS q3
      FROM bills b
      LEFT JOIN products p1 ON b.p1 = p1.product_id
      LEFT JOIN products p2 ON b.p2 = p2.product_id
      LEFT JOIN products p3 ON b.p3 = p3.product_id
      WHERE b.user_id = ? ORDER BY b.bill_date DESC
    `;
    db.query(sql, [uid], (err, bills) => {
      if (err) return res.send("Error fetching bills");
      res.render("userbilling", { bills, user: req.session.user, cartCount });
    });
  });
};

exports.getAdminBills = (req, res) => {
  const sql = `
    SELECT b.bill_id, b.total_amount, b.status, b.bill_date, u.name AS username,
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
  db.query(sql, (err, bills) => {
    if (err) return res.send("Error fetching bills");
    res.render("adminbillings", { bills });
  });
};

exports.postUpdateBill = (req, res) => {
  const { status } = req.body;
  const bill_id = req.params.bill_id;
  db.query("UPDATE bills SET status = ? WHERE bill_id = ?", [status, bill_id], (err) => {
    if (err) return res.send("Error updating status");
    res.redirect("/admin_bills");
  });
};
