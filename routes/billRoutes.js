const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/admin_login');
};

router.get('/billing', billController.getBilling);
router.get('/my-bills', billController.getMyBills);
router.get('/admin_bills', isAdmin, billController.getAdminBills);
router.post('/update-bill/:bill_id', isAdmin, billController.postUpdateBill);

module.exports = router;
