const express = require('express');
const router = express.Router();
const staticController = require('../controllers/staticController');

router.post('/screenInfo', staticController.screenInfo);
router.post('/theaterInfo', staticController.theaterInfo);

module.exports = router;