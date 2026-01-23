const express = require('express');
const router = express.Router();
const { searchLanguages } = require('../controllers/languageController');

router.get('/search', searchLanguages);

module.exports = router;
