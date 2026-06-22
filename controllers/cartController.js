const db = require('../db');

exports.getCart = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/user_login");
  }
  const id = req.session.user.id;
  let cartCount = 0;
  const countSql = "SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?";
  db.query(countSql, [id], (err, result) => {
    if (err) throw err;
    cartCount = result[0].count || 0;

    const sql = `
      SELECT 
          c.cart_id, c.user_id, c.quantity,
          u.name AS user_name, u.address, u.phone_number,
          p.product_id, p.product_name, p.price, p.img_url
      FROM cart c
      JOIN users u ON c.user_id = u.user_id
      JOIN products p ON c.product_id = p.product_id
      WHERE c.user_id = ?;
    `;

    db.query(sql, [id], (err, products) => {
      if (err) throw err;
      let total = 0;
      let titem = 0;
      for (const item of products) {
        total += item.price * item.quantity;
        titem += item.quantity;
      }
      res.render("cart", { products, total, titem, user: req.session.user, cartCount, razorpay_key_id: process.env.RAZORPAY_KEY_ID });
    });
  });
};

exports.getAddToCart = (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.redirect("/user_login");
  }
  const productId = req.params.id;
  const uid = req.session.user.id;
  const sql = `INSERT INTO cart(user_id,product_id,quantity) VALUES (?,?,?)`;
  db.query(sql, [uid, productId, 1], (err, result1) => {
    if (err) throw err;
  });
  res.redirect("/");
};

exports.getUpdateCartMinus = (req, res) => {
  const uid = req.session.user.id;
  const pid = req.params.pid;
  const sql = "select quantity from cart where user_id = ? and product_id = ?";
  db.query(sql, [uid, pid], (err, result) => {
    if(err) throw err;
    if(result.length > 0) {
      let q = result[0].quantity;
      if (q == 1) {
        db.query("delete from cart where user_id = ? and product_id = ?", [uid, pid], (err, result) => {});
      } else {
        q = q - 1;
        db.query("update cart set quantity = ? where user_id = ? and product_id = ?", [q, uid, pid], (err, result) => {});
      }
    }
  });
  res.redirect("/cart");
};

exports.getUpdateCartPlus = (req, res) => {
  const uid = req.session.user.id;
  const pid = req.params.pid;
  const sql = "select quantity from cart where user_id = ? and product_id = ?";
  db.query(sql, [uid, pid], (err, result) => {
    if(err) throw err;
    if(result.length > 0) {
      let q = result[0].quantity;
      q = q + 1;
      db.query("update cart set quantity = ? where user_id = ? and product_id = ?", [q, uid, pid], (err, result) => {});
    }
  });
  res.redirect("/cart");
};
