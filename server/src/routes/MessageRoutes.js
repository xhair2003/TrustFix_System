const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const ChatController = require("../controllers/ChatController");

router.post("/send-message", AuthMiddleware.verifyToken, ChatController.sendMessage);


module.exports = router;