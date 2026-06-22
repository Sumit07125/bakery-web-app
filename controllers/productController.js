const db = require('../db');

exports.getIndex = (req, res) => {
  let cartCount = 0;
  if (req.session.user) {
    const sql = "SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?";
    db.query(sql, [req.session.user.id], (err, result) => {
      if (err) throw err;
      cartCount = result[0] ? result[0].count || 0 : 0;
      db.query("SELECT * FROM products ORDER BY RAND()", (err, products) => {
        if (err) throw err;
        res.render("main", { products, user: req.session.user, cartCount });
      });
    });
  } else {
    db.query("SELECT * FROM products ORDER BY RAND()", (err, products) => {
      if (err) throw err;
      res.render("main", { products, user: req.session.user, cartCount });
    });
  }
};

exports.getSearch = (req, res) => {
  const query = req.query.query;
  let cartCount = 0;
  if (req.session.user) {
    const sql = "SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?";
    db.query(sql, [req.session.user.id], (err, result) => {
      if (err) throw err;
      cartCount = result[0] ? result[0].count || 0 : 0;
      const sql2 = "SELECT * FROM products WHERE product_name LIKE ?";
      db.query(sql2, [`%${query}%`], (err, products) => {
        if (err) throw err;
        res.render("main", { products, user: req.session.user, cartCount });
      });
    });
  } else {
    const sql = "SELECT * FROM products WHERE product_name LIKE ?";
    db.query(sql, [`%${query}%`], (err, products) => {
      if (err) throw err;
      res.render("main", { products, user: req.session.user, cartCount });
    });
  }
};

exports.getProductDetail = (req, res) => {
  const productId = req.params.pid;
  const sql = `SELECT * FROM products WHERE product_id = ?`;
  let cartCount = 0;
  if (req.session.user) {
    const countSql = "SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?";
    db.query(countSql, [req.session.user.id], (err, result) => {
      if (err) throw err;
      cartCount = result[0] ? result[0].count || 0 : 0;
      db.query(sql, [productId], (err, result) => {
        if (err) throw err;
        const product = result[0];
        res.render("product_detail", { product, user: req.session.user, cartCount });
      });
    });
  } else {
    db.query(sql, [productId], (err, result) => {
      if (err) throw err;
      const product = result[0];
      res.render("product_detail", { product, user: req.session.user, cartCount });
    });
  }
};

exports.getAddItems = (req, res) => {
  res.render("additems");
};

exports.postAddItems = (req, res) => {
  const { name, price, quantity, img_url } = req.body;
  const sql = `INSERT INTO products(product_name,price,quantity,img_url) VALUES (?,?,?,?)`;
  db.query(sql, [name, price, quantity, img_url], (err, result) => {
    if (err) throw err;
    console.log("Record inserted:", result.affectedRows);
  });
  res.redirect("/admin");
};

exports.getViewProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, products) => {
    if (err) throw err;
    res.render("view_products", { products });
  });
};
