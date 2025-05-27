const cron = require('node-cron');
const {sendEmail} = require('../utils/sendEmail');
const {Transaction , RepairmanUpgradeRequest} = require('../models')
const { CRON_TIME } = require('../constants'); 

// const checkVipExpirationAndSendEmails = async () => {
//     try {
//       const currentDate = new Date();
  
//       // Lấy tất cả các giao dịch có `payCode` bắt đầu bằng "VIP"
//       const vipTransactions = await Transaction.find({
//         payCode: { $regex: /^VIP/ },
//         transactionType: "payment",
//         status: 1,
//       }).populate({
//         path: "wallet_id",
//         populate: { path: "user_id", select: "firstName lastName email" },
//       });
  
//       if (!vipTransactions || vipTransactions.length === 0) {
//         console.log("Không tìm thấy giao dịch VIP nào!");
//         return;
//       }
  
//       for (const transaction of vipTransactions) {
//         // Kiểm tra nếu `wallet_id` hoặc `user_id` bị null
//         if (!transaction.wallet_id || !transaction.wallet_id.user_id) {
//           console.log(`Giao dịch không hợp lệ: ${transaction._id}`);
//           continue; // Bỏ qua giao dịch không hợp lệ
//         }
  
//         const user = transaction.wallet_id.user_id; // Lấy thông tin người dùng
//         const vipStartDate = transaction.createdAt; // Ngày bắt đầu từ giao dịch
  
//         // Tìm gói VIP liên quan đến giao dịch
//         const repairmanRequest = await RepairmanUpgradeRequest.findOne({
//           user_id: user._id,
//           vip_id: { $ne: null },
//         }).populate("vip_id");
  
//         if (!repairmanRequest || !repairmanRequest.vip_id) {
//           console.log(`Không tìm thấy gói VIP cho user_id: ${user._id}`);
//           continue; // Bỏ qua nếu không tìm thấy gói VIP
//         }
  
//         const vipPackage = repairmanRequest.vip_id; // Gói VIP
//         const vipExpiryDate = new Date(vipStartDate);
//         vipExpiryDate.setMonth(vipExpiryDate.getMonth() + vipPackage.duration); // Tính ngày hết hạn
  
//         // Tính thời gian còn lại
//         const daysUntilExpiry = Math.ceil((vipExpiryDate - currentDate) / (1000 * 60 * 60 * 24));
  
//         // Gửi email trước 3 ngày hết hạn
//         if (daysUntilExpiry === 3) {
//           const emailContent = `
//             <h1>Thông báo sắp hết hạn gói VIP</h1>
//             <p>Xin chào ${user.firstName} ${user.lastName},</p>
//             <p>Gói VIP của bạn sẽ hết hạn vào ngày ${vipExpiryDate.toISOString().split("T")[0]}.</p>
//             <p>Vui lòng gia hạn để tiếp tục sử dụng các dịch vụ của chúng tôi.</p>
//           `;
//           await sendEmail(user.email, "Thông báo sắp hết hạn gói VIP", emailContent);
//           console.log(`Đã gửi email nhắc nhở trước 3 ngày cho user_id: ${user._id}`);
//         }
  
//         // Gửi email sau khi hết hạn
//         if (daysUntilExpiry < 0) {
//           repairmanRequest.vip_id = null; // Đặt lại gói VIP
//           await repairmanRequest.save(); 
//           const emailContent = `
//             <h1>Thông báo gói VIP đã hết hạn</h1>
//             <p>Xin chào ${user.firstName} ${user.lastName},</p>
//             <p>Gói VIP của bạn đã hết hạn vào ngày ${vipExpiryDate.toISOString().split("T")[0]}.</p>
//             <p>Vui lòng gia hạn để tiếp tục sử dụng các dịch vụ của chúng tôi.</p>
//           `;
//           await sendEmail(user.email, "Thông báo gói VIP đã hết hạn", emailContent);
//           console.log(`Đã gửi email thông báo hết hạn cho user_id: ${user._id}`);
//         }
//       }
  
//       console.log("Hoàn thành kiểm tra và gửi email.");
//     } catch (error) {
//       console.error("Error ", error);
//     }
//   };
  

 // Thiết lập cron job để chạy hàng ngày lúc 00:00
  // console.log('CRON_TIME.EVERY_MONTH:', CRON_TIME.EVERY_DAY_AT_MIDNIGHT);
  // const job = cron.schedule(CRON_TIME.EVERY_DAY_AT_MIDNIGHT, () => {
  //   console.log(" Bắt đầu kiểm tra trạng thái VIP và gửi email...");
  //   checkVipExpirationAndSendEmails();
  // }, {
  //   scheduled: true,
  //   timezone: 'Asia/Ho_Chi_Minh',
  // });
  // console.log('Cron job scheduled:', job);




const checkVipExpirationAndSendEmails = async () => {
  try {
    // Thời gian hiện tại: 15:57, 26/5/2025 (+07:00)
    const currentDate = new Date();
    const targetWalletId = '6833f54d0ac9d5655e53eca9'; // Wallet ID để test

    // Lấy các giao dịch VIP với wallet_id cụ thể
    const vipTransactions = await Transaction.find({
      payCode: { $regex: /^VIP/, $options: 'i' }, // Lọc giao dịch VIP
      transactionType: 'payment',
      status: 1,
      wallet_id: targetWalletId,
    }).populate({
      path: 'wallet_id',
      populate: { path: 'user_id', select: 'firstName lastName email' },
    });

    if (!vipTransactions || vipTransactions.length === 0) {
      console.log(`Không tìm thấy giao dịch VIP nào cho wallet_id: ${targetWalletId}`);
      return;
    }

    for (const transaction of vipTransactions) {
      // Kiểm tra tính hợp lệ của giao dịch
      if (!transaction.wallet_id || !transaction.wallet_id.user_id) {
        console.log(`Giao dịch không hợp lệ: ${transaction._id}`);
        continue;
      }

      const user = transaction.wallet_id.user_id; // Thông tin người dùng
      const vipStartDate = new Date(transaction.createdAt); // Thời điểm bắt đầu mua

      // Kiểm tra tính hợp lệ của vipStartDate
      if (isNaN(vipStartDate.getTime())) {
        console.log(`Ngày bắt đầu không hợp lệ cho giao dịch: ${transaction._id}`);
        continue;
      }

      // Tìm yêu cầu nâng cấp VIP
      const repairmanRequest = await RepairmanUpgradeRequest.findOne({
        user_id: user._id,
        vip_id: { $ne: null },
      }).populate('vip_id');

      if (!repairmanRequest || !repairmanRequest.vip_id) {
        console.log(`Không tìm thấy gói VIP cho user_id: ${user._id}`);
        continue;
      }

      // Tính thời gian hết hạn (5 phút sau vipStartDate)
      const vipExpiryDate = new Date(vipStartDate);
      vipExpiryDate.setMinutes(vipExpiryDate.getMinutes() + 5);

      // Tính thời gian từ lúc mua đến hiện tại (phút)
      const minutesSinceStart = Math.floor((currentDate - vipStartDate) / (1000 * 60));

      // Tính thời gian còn lại đến khi hết hạn (phút)
      const minutesUntilExpiry = Math.ceil((vipExpiryDate - currentDate) / (1000 * 60));

      console.log(
        `User_id: ${user._id} | Thời gian kể từ khi mua: ${minutesSinceStart} phút | Còn lại: ${minutesUntilExpiry} phút`
      );

      // Gửi email nhắc nhở khi còn 1 phút
      if (minutesUntilExpiry === 1) {
        const emailContent = `
          <h1>Thông báo sắp hết hạn gói VIP</h1>
          <p>Xin chào ${user.firstName} ${user.lastName},</p>
          <p>Gói VIP của bạn sẽ hết hạn vào ${vipExpiryDate.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
          })}.</p>
          <p>Vui lòng gia hạn để tiếp tục sử dụng các dịch vụ của chúng tôi.</p>
        `;
        await sendEmail(user.email, 'Thông báo sắp hết hạn gói VIP', emailContent);
        console.log(`Đã gửi email nhắc nhở trước 1 phút cho user_id: ${user._id}`);
      }

      // Gửi email thông báo và đặt lại vip_id khi hết hạn
      if (minutesUntilExpiry <= 0) {
        // repairmanRequest.vip_id = null;
        await repairmanRequest.save();
        const emailContent = `
          <h1>Thông báo gói VIP đã hết hạn</h1>
          <p>Xin chào ${user.firstName} ${user.lastName},</p>
          <p>Gói VIP của bạn đã hết hạn vào ${vipExpiryDate.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
          })}.</p>
          <p>Vui lòng gia hạn để tiếp tục sử dụng các dịch vụ của chúng tôi.</p>
        `;
        await sendEmail(user.email, 'Thông báo gói VIP đã hết hạn', emailContent);
        console.log(`Đã gửi email thông báo hết hạn cho user_id: ${user._id}`);
      }
    }

    console.log(`Hoàn thành kiểm tra và gửi email cho wallet_id: ${targetWalletId}`);
  } catch (error) {
    console.error(`Lỗi khi kiểm tra thời hạn VIP: ${error.message}`);
  }
};


  // Thiết lập cron job để chạy hàng ngày lúc 00:00
  console.log('CRON_TIME.EVERY_MONTH:', CRON_TIME.EVERY_MINUTE);
  const job = cron.schedule(CRON_TIME.EVERY_MINUTE, () => {
    console.log(" Bắt đầu kiểm tra trạng thái VIP và gửi email...");
    checkVipExpirationAndSendEmails();
  }, {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh',
  });
  console.log('Cron job scheduled:', job);
  
