const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/cart', cartController.getCart);
router.get('/addtocart/:id', cartController.getAddToCart);
router.get('/updatecartminus/:pid', cartController.getUpdateCartMinus);
router.get('/updatecartplus/:pid', cartController.getUpdateCartPlus);
router.get('/remove_from_cart/:pid', cartController.getRemoveFromCart);

module.exports = router;
