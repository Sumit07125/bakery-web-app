const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
router.get('/user_login', authController.getUserLogin);
router.post('/user_login', authController.postUserLogin);
router.get('/admin_login', authController.getAdminLogin);
router.post('/admin_login', authController.postAdminLogin);
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/admin_login');
};

router.get('/admin', isAdmin, authController.getAdmin);
router.get('/profile', authController.getProfile);
router.get('/edit-profile', authController.getEditProfile);
router.post('/edit-profile', authController.postEditProfile);
router.get('/logout', authController.logout);

module.exports = router;
