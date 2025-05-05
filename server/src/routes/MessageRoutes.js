const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/authMiddleware");
const ChatController = require("../controllers/ChatController");

router.post("/send-message", AuthMiddleware.verifyToken, ChatController.sendMessage);
router.get("/get-chat-history/:opponent?", AuthMiddleware.verifyToken, ChatController.getChatHistory); // opponent là tùy chọn

module.exports = router;