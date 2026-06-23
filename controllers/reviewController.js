const db = require('../db');

// POST /product/:pid/review
exports.postAddReview = (req, res) => {
  if (!req.session.user) return res.redirect('/user_login');

  const uid = req.session.user.id;
  const pid = req.params.pid;
  const { rating, review_text } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.redirect(`/product/${pid}?toast=error&msg=Invalid+rating`);
  }

  // Check if user already reviewed this product
  db.query('SELECT review_id FROM reviews WHERE user_id = ? AND product_id = ?', [uid, pid], (err, existing) => {
    if (err) return res.redirect(`/product/${pid}?toast=error&msg=Something+went+wrong`);

    if (existing.length > 0) {
      // Update existing review
      db.query('UPDATE reviews SET rating = ?, review_text = ? WHERE user_id = ? AND product_id = ?',
        [rating, review_text, uid, pid], (err2) => {
          if (err2) return res.redirect(`/product/${pid}?toast=error&msg=Error+updating+review`);
          return res.redirect(`/product/${pid}?toast=success&msg=Review+updated+successfully`);
        });
    } else {
      // Insert new review
      db.query('INSERT INTO reviews (product_id, user_id, rating, review_text) VALUES (?, ?, ?, ?)',
        [pid, uid, rating, review_text], (err2) => {
          if (err2) return res.redirect(`/product/${pid}?toast=error&msg=Error+saving+review`);
          return res.redirect(`/product/${pid}?toast=success&msg=Review+submitted+successfully`);
        });
    }
  });
};

// POST /product/:pid/review/delete
exports.postDeleteReview = (req, res) => {
  if (!req.session.user) return res.redirect('/user_login');
  
  const uid = req.session.user.id;
  const pid = req.params.pid;

  db.query('DELETE FROM reviews WHERE user_id = ? AND product_id = ?', [uid, pid], (err) => {
    if (err) return res.redirect(`/product/${pid}?toast=error&msg=Error+deleting+review`);
    return res.redirect(`/product/${pid}?toast=success&msg=Review+deleted+successfully`);
  });
};
