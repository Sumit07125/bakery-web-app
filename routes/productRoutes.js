const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/admin_login');
};

router.get('/', productController.getIndex);
router.get('/search', productController.getSearch);
router.get('/product/:pid', productController.getProductDetail);

router.get('/additems', isAdmin, productController.getAddItems);
router.post('/additems', isAdmin, productController.postAddItems);
router.get('/view_products', isAdmin, productController.getViewProducts);

module.exports = router;
