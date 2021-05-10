const {Router} = require('express');
const router = Router();
const authController = require('../Controller/authController');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.get('/verifyUser', authController.verifyuser);

module.exports = router;