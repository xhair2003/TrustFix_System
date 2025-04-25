const {Message} = require('../models');


const sendMessage = async (req, res) => {
    try {
      const senderId = req.user.id; // Lấy senderId từ token
      const { receiverId, message } = req.body;
  
      if (!receiverId || !message) {
        return res.status(400).json({
          EC: 0,
          EM: "receiverId và message là bắt buộc!",
        });
      }
  
      // Lưu tin nhắn vào MongoDB
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
      });
  
      await newMessage.save();
  
      return res.status(200).json({
        EC: 1,
        EM: "Tin nhắn đã được gửi thành công!",
        DT: {
          senderId,
          receiverId,
          message,
          timestamp: newMessage.timestamp,
        },
      });
    } catch (error) {
      console.error("Error in sendMessage:", error);
      return res.status(500).json({
        EC: 0,
        EM: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
      });
    }
  };


const getChatHistory = async (req, res) => {
    const { userId } = req.params; // ID của người dùng cần lấy lịch sử chat
    const repairmanId = req.user.id; // ID của thợ sửa chữa (lấy từ token)
  
    try {
      // Lấy lịch sử tin nhắn giữa repairman và user
      const messages = await Message.find({
        $or: [
          { senderId: repairmanId, receiverId: userId },
          { senderId: userId, receiverId: repairmanId },
        ],
      }).sort({ timestamp: 1 }); // Sắp xếp theo thời gian (cũ -> mới)
  
      return res.status(200).json({
        EC: 1,
        EM: "Lấy lịch sử chat thành công!",
        DT: messages,
      });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return res.status(500).json({
        EC: 0,
        EM: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
      });
    }
  };

  module.exports = {
    sendMessage,
    getChatHistory,
  };