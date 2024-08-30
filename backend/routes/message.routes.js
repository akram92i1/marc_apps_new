const express = require('express');
const router = express.Router();
const protectRoute = require("../middleware/protectRoute")
const { sendMessage } = require('../controller/message.controller');
router.post("/send/:userId" ,protectRoute, sendMessage) ;
module.exports = router;