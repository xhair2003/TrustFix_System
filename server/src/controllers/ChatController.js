const { Message, User } = require('../models');
const { checkProhibitedContent } = require('../constants');

const sendMessage = async (req, res) => {
  try {
    const io = req.app.get("io"); // Lấy io từ app (sẽ cấu hình trong index.js)
    const senderId = req.user.id; // Lấy senderId từ token
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({
        EC: 0,
        EM: "receiverId và message là bắt buộc!",
      });
    }

    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({
        EC: 0,
        EM: 'Người nhận không tồn tại!',
      });
    }

    // Kiểm tra nội dung tin nhắn
    const { isViolated, violations } = checkProhibitedContent(message);
    if (isViolated) {
      const errorMessage = violations
        .map((v) => `Nội dung "${v.matched}" vi phạm: ${v.description}`)
        .join('; ');
      return res.status(400).json({
        EC: 0,
        EM: `Tin nhắn chứa nội dung không được phép: ${errorMessage}. Vui lòng nhập lại!`,
      });
    }

    // Lưu tin nhắn vào MongoDB
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    // io.to(senderId.toString()).emit("sendMessage");
    // io.to(receiverId).emit("receiveMessage");

    // Chỉ gửi socket cho receiverId
    io.to(receiverId.toString()).emit("receiveMessage", {
      senderId,
      receiverId,
      message,
      timestamp: newMessage.timestamp,
    });

    return res.status(200).json({
      EC: 1,
      EM: "Tin nhắn đã được gửi thành công!",
      DT: message,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(500).json({
      EC: 0,
      EM: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
    });
  }
};

// const getChatHistory = async (req, res) => {
//   const { opponent } = req.params;
//   const myself = req.user.id;

//   try {
//     // Lấy lịch sử tin nhắn giữa repairman và user
//     const messages = await Message.find({
//       $or: [
//         { senderId: myself, receiverId: opponent },
//         { senderId: opponent, receiverId: myself },
//       ],
//     }).sort({ timestamp: 1 }); // Sắp xếp theo thời gian (cũ -> mới)

//     return res.status(200).json({
//       EC: 1,
//       EM: "Lấy lịch sử chat thành công!",
//       DT: messages,
//     });
//   } catch (error) {
//     console.error("Error fetching chat history:", error);
//     return res.status(500).json({
//       EC: 0,
//       EM: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
//     });
//   }
// };

const getChatHistory = async (req, res) => {
  const { opponent } = req.params; // opponent là user_id của đối phương (nếu có)
  const myself = req.user.id; // ID của người dùng hiện tại

  try {
    let query;

    if (opponent) {
      // Lấy tin nhắn giữa myself và opponent cụ thể
      query = {
        $or: [
          { senderId: myself, receiverId: opponent },
          { senderId: opponent, receiverId: myself },
        ],
      };
    } else {
      // Lấy tất cả tin nhắn của myself với mọi đối phương
      query = {
        $or: [
          { senderId: myself },
          { receiverId: myself },
        ],
      };
    }

    // Lấy lịch sử tin nhắn và sắp xếp theo thời gian
    const messages = await Message.find(query)
      .sort({ timestamp: 1 }) // Sắp xếp từ cũ đến mới
      .populate('senderId', 'firstName lastName') // Lấy tên của sender
      .populate('receiverId', 'firstName lastName'); // Lấy tên của receiver

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