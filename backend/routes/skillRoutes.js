const express = require('express');
const router = express.Router();
const { searchSkills } = require('../controllers/skillController');

router.get('/search', searchSkills);

module.exports = router;
