const Message = require('../models/Message')
const { Violation, User } = require('../models');
const { sendEmail } = require('../utils/sendEmail');
const { PROHIBITED_PATTERNS } = require('../constants');

const RepairmanSocket = (io, socket) => {
    const sendMessage = async ({ receiverId, message }, callback) => {
        try {
            const senderId = socket.user.id;
            const sender = await User.findById(senderId);

            if (!sender || sender.status === 'Banned') {
                return callback({ success: false, error: "Tài khoản đã bị khóa hoặc không tồn tại." });
            }

            const isProhibited = PROHIBITED_PATTERNS.some((pattern) => pattern.test(message));
            if (isProhibited) {
                await new Violation({
                    user_id: senderId,
                    content: message,
                }).save();

                const violationCount = await Violation.countDocuments({ user_id: senderId });

                if (violationCount === 1) {
                    await sendEmail(
                        sender.email,
                        'Cảnh báo vi phạm tin nhắn',
                        `
                    <h1>Vi phạm nội dung tin nhắn</h1>
                    <p>Chào ${sender.firstName} ${sender.lastName},</p>
                    <p>Nội dung tin nhắn của bạn đã vi phạm quy định:</p>
                    <blockquote><strong>${message}</strong></blockquote>
                    <p>Nếu bạn tiếp tục vi phạm, tài khoản sẽ bị khóa và các đơn hàng sẽ bị hủy.</p>
                  `
                    );
                } else if (violationCount >= 2) {
                    sender.status = 'Banned';
                    await sender.save();

                    await Deal.updateMany(
                        { handymanId: senderId, status: { $nin: ['Cancelled', 'Completed'] } },
                        { $set: { status: 'Cancelled' } }
                    );

                    await sendEmail(
                        sender.email,
                        'Tài khoản bị khóa do vi phạm',
                        `
                    <h1>Tài khoản bị khóa</h1>
                    <p>Chào ${sender.firstName} ${sender.lastName},</p>
                    <p>Bạn đã vi phạm quy định nhiều lần. Tài khoản bị khóa và các đơn hàng đang xử lý đã bị hủy.</p>
                  `
                    );

                    io.to(senderId.toString()).emit('userBanned', {
                        message: 'Tài khoản của bạn đã bị khóa do vi phạm quy định nội dung!',
                    });

                    return callback({ success: false, error: "Tài khoản của bạn đã bị khóa do vi phạm nội dung." });
                }

                return callback({ success: false, error: "Tin nhắn chứa nội dung vi phạm quy định." });
            }

            const newMessage = new Message({
                senderId,
                receiverId,
                message,
            });

            const savedMessage = await newMessage.save();

            io.to(receiverId).emit("receiveMessage", savedMessage);

            if (callback) {
                callback({ success: true, data: savedMessage });
            }

            console.log(`Message sent from ${senderId} to ${receiverId}`);
        } catch (error) {
            console.error("Error sending message:", error);
            if (callback) {
                callback({ success: false, error: error.message });
            }
        }
    };

    socket.on("sendMessage", sendMessage);
};

module.exports = RepairmanSocket
