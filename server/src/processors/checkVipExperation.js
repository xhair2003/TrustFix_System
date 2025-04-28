const cron = require('node-cron');
const {sendEmail} = require('../utils/sendEmail');
const {Transaction , RepairmanUpgradeRequest} = require('../models')
const { CRON_TIME } = require('../constants'); 

const checkVipExpirationAndSendEmails = async () => {
    try {
      const currentDate = new Date();
  
      // Lấy tất cả các giao dịch có `payCode` bắt đầu bằng "VIP"
      const vipTransactions = await Transaction.find({
        payCode: { $regex: /^VIP/ },
        transactionType: "payment",
        status: 1,
      }).populate({
        path: "wallet_id",
        populate: { path: "user_id", select: "firstName lastName email" },
      });
  
      if (!vipTransactions || vipTransactions.length === 0) {
        console.log("Không tìm thấy giao dịch VIP nào!");
        return;
      }
  
      for (const transaction of vipTransactions) {
        // Kiểm tra nếu `wallet_id` hoặc `user_id` bị null
        if (!transaction.wallet_id || !transaction.wallet_id.user_id) {
          console.log(`Giao dịch không hợp lệ: ${transaction._id}`);
          continue; // Bỏ qua giao dịch không hợp lệ
        }
  
        const user = transaction.wallet_id.user_id; // Lấy thông tin người dùng
        const vipStartDate = transaction.createdAt; // Ngày bắt đầu từ giao dịch
  
        // Tìm gói VIP liên quan đến giao dịch
        const repairmanRequest = await RepairmanUpgradeRequest.findOne({
          user_id: user._id,
          vip_id: { $ne: null },
        }).populate("vip_id");
  
        if (!repairmanRequest || !repairmanRequest.vip_id) {
          console.log(`Không tìm thấy gói VIP cho user_id: ${user._id}`);
          continue; // Bỏ qua nếu không tìm thấy gói VIP
        }
  
        const vipPackage = repairmanRequest.vip_id; // Gói VIP
        const vipExpiryDate = new Date(vipStartDate);
        vipExpiryDate.setMonth(vipExpiryDate.getMonth() + vipPackage.duration); // Tính ngày hết hạn
  
        // Tính thời gian còn lại
        const daysUntilExpiry = Math.ceil((vipExpiryDate - currentDate) / (1000 * 60 * 60 * 24));
  
        // Gửi email trước 3 ngày hết hạn
        if (daysUntilExpiry === 3) {
          const emailContent = `
            <h1>Thông báo sắp hết hạn gói VIP</h1>
            <p>Xin chào ${user.firstName} ${user.lastName},</p>
            <p>Gói VIP của bạn sẽ hết hạn vào ngày ${vipExpiryDate.toISOString().split("T")[0]}.</p>
            <p>Vui lòng gia hạn để tiếp tục sử dụng các dịch vụ của chúng tôi.</p>
          `;
          await sendEmail(user.email, "Thông báo sắp hết hạn gói VIP", emailContent);
          console.log(`Đã gửi email nhắc nhở trước 3 ngày cho user_id: ${user._id}`);
        }
  
        // Gửi email sau khi hết hạn
        if (daysUntilExpiry < 0) {
          repairmanRequest.vip_id = null; // Đặt lại gói VIP
          await repairmanRequest.save(); 
          const emailContent = `
            <h1>Thông báo gói VIP đã hết hạn</h1>
            <p>Xin chào ${user.firstName} ${user.lastName},</p>
            <p>Gói VIP của bạn đã hết hạn vào ngày ${vipExpiryDate.toISOString().split("T")[0]}.</p>
            <p>Vui lòng gia hạn để tiếp tục sử dụng các dịch vụ của chúng tôi.</p>
          `;
          await sendEmail(user.email, "Thông báo gói VIP đã hết hạn", emailContent);
          console.log(`Đã gửi email thông báo hết hạn cho user_id: ${user._id}`);
        }
      }
  
      console.log("Hoàn thành kiểm tra và gửi email.");
    } catch (error) {
      console.error("Error ", error);
    }
  };
  
  // Thiết lập cron job để chạy hàng ngày lúc 00:00
  console.log('CRON_TIME.EVERY_MONTH:', CRON_TIME.EVERY_DAY_AT_MIDNIGHT);
  const job = cron.schedule(CRON_TIME.EVERY_DAY_AT_MIDNIGHT, () => {
    console.log(" Bắt đầu kiểm tra trạng thái VIP và gửi email...");
    checkVipExpirationAndSendEmails();
  }, {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh',
  });
  console.log('Cron job scheduled:', job);
  
