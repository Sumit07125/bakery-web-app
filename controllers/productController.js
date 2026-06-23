const db = require('../db');

exports.getIndex = (req, res) => {
  const category = req.query.category || 'All';
  let cartCount = 0;

  const getProducts = (userId, cb) => {
    let sql, params;
    if (category === 'All') {
      sql = `
        SELECT p.*, ROUND(COALESCE(AVG(r.rating), 0), 1) AS avg_rating, COUNT(r.review_id) AS review_count
        FROM products p
        LEFT JOIN reviews r ON p.product_id = r.product_id
        GROUP BY p.product_id
        ORDER BY RAND()
      `;
      params = [];
    } else {
      sql = `
        SELECT p.*, ROUND(COALESCE(AVG(r.rating), 0), 1) AS avg_rating, COUNT(r.review_id) AS review_count
        FROM products p
        LEFT JOIN reviews r ON p.product_id = r.product_id
        WHERE p.category = ?
        GROUP BY p.product_id
        ORDER BY RAND()
      `;
      params = [category];
    }
    db.query(sql, params, cb);
  };

  if (req.session.user) {
    const countSql = "SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?";
    db.query(countSql, [req.session.user.id], (err, result) => {
      if (err) throw err;
      cartCount = result[0] ? result[0].count || 0 : 0;
      getProducts(req.session.user.id, (err, products) => {
        if (err) throw err;
        res.render("main", { products, user: req.session.user, cartCount, activeCategory: category });
      });
    });
  } else {
    getProducts(null, (err, products) => {
      if (err) throw err;
      res.render("main", { products, user: null, cartCount, activeCategory: category });
    });
  }
};

exports.getSearch = (req, res) => {
  const query = req.query.query;
  let cartCount = 0;
  const sql = `
    SELECT p.*, ROUND(COALESCE(AVG(r.rating), 0), 1) AS avg_rating, COUNT(r.review_id) AS review_count
    FROM products p
    LEFT JOIN reviews r ON p.product_id = r.product_id
    WHERE p.product_name LIKE ?
    GROUP BY p.product_id
  `;

  if (req.session.user) {
    db.query("SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?", [req.session.user.id], (err, result) => {
      if (err) throw err;
      cartCount = result[0] ? result[0].count || 0 : 0;
      db.query(sql, [`%${query}%`], (err, products) => {
        if (err) throw err;
        res.render("main", { products, user: req.session.user, cartCount, activeCategory: 'All' });
      });
    });
  } else {
    db.query(sql, [`%${query}%`], (err, products) => {
      if (err) throw err;
      res.render("main", { products, user: null, cartCount, activeCategory: 'All' });
    });
  }
};

exports.getProductDetail = (req, res) => {
  const productId = req.params.pid;
  let cartCount = 0;
  const uid = req.session.user ? req.session.user.id : null;

  const productSql = `
    SELECT p.*, ROUND(COALESCE(AVG(r.rating), 0), 1) AS avg_rating, COUNT(r.review_id) AS review_count
    FROM products p
    LEFT JOIN reviews r ON p.product_id = r.product_id
    WHERE p.product_id = ?
    GROUP BY p.product_id
  `;
  const reviewsSql = `
    SELECT r.rating, r.review_text, r.created_at, u.name AS reviewer_name
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `;
  const hasPurchasedSql = `
    SELECT b.bill_id FROM bills b
    WHERE b.user_id = ? AND (b.p1 = ? OR b.p2 = ? OR b.p3 = ?)
    LIMIT 1
  `;
  const myReviewSql = `SELECT * FROM reviews WHERE user_id = ? AND product_id = ? LIMIT 1`;

  const fetchData = () => {
    db.query(productSql, [productId], (err, result) => {
      if (err) throw err;
      const product = result[0];
      if (!product) return res.redirect('/');

      db.query(reviewsSql, [productId], (err2, reviews) => {
        if (err2) throw err2;

        if (!uid) {
          return res.render("product_detail", { product, reviews, user: null, cartCount, hasPurchased: false, myReview: null });
        }

        db.query(hasPurchasedSql, [uid, productId, productId, productId], (err3, purchased) => {
          const hasPurchased = purchased && purchased.length > 0;
          db.query(myReviewSql, [uid, productId], (err4, myReviewResult) => {
            const myReview = myReviewResult && myReviewResult.length > 0 ? myReviewResult[0] : null;
            res.render("product_detail", { product, reviews, user: req.session.user, cartCount, hasPurchased, myReview });
          });
        });
      });
    });
  };

  if (uid) {
    db.query("SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?", [uid], (err, result) => {
      if (err) throw err;
      cartCount = result[0] ? result[0].count || 0 : 0;
      fetchData();
    });
  } else {
    fetchData();
  }
};

exports.getAddItems = (req, res) => {
  res.render("additems");
};

exports.postAddItems = (req, res) => {
  const { name, price, quantity, img_url, description, category } = req.body;
  const sql = `INSERT INTO products(product_name, price, quantity, img_url, description, category) VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [name, price, quantity, img_url, description || '', category || 'Other'], (err, result) => {
    if (err) throw err;
    console.log("Record inserted:", result.affectedRows);
    res.redirect("/admin?toast=success&msg=Product+added+successfully");
  });
};

exports.getViewProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, products) => {
    if (err) throw err;
    res.render("view_products", { products });
  });
};
