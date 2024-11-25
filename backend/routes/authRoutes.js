const express = require('express');
const { signUpCotrl, signInCotrl } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signUpCotrl);
router.post('/signin', signInCotrl);

module.exports = router;