const express = require('express');
const router = express.Router();
const staticController = require('../controllers/staticController');

router.post('/movieInfo', staticController.movieDetail_Info);
router.post('/casts', staticController.movieDetail_Cast);
router.post('/reviews', staticController.movieDetail_Reviews);
router.post('/moviescheduled', staticController.movieScheduled);

module.exports = router;