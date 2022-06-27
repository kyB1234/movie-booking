const express = require("express");
const verifyController = require('../controllers/verifyController');

const router = express.Router();
router.get("/:id", verifyController.checkAdmin, verifyController.verify);
module.exports = router;
