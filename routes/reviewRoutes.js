const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/product/:pid/review', reviewController.postAddReview);
router.post('/product/:pid/review/delete', reviewController.postDeleteReview);

module.exports = router;
