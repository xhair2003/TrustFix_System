const cron = require("node-cron");
const mongoose = require('mongoose');
const { User, Wallet, Transaction } = require("../models");
const { CRON_TIME, MONTHLY_FEE } = require("../constants");
const { sendEmail } = require("../utils/sendEmail");

const processMonthlyFee = async () => {
  try {
    console.log("Đang chạy cron job tính phí hằng tháng...");

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error("MongoDB connection is not active");
      return;
    }

    const users = await User.find();
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    for (const user of users) {
      // Validate user email
      if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        console.log(`Invalid or missing email for user ${user._id}`);
        continue;
      }

      const wallet = await Wallet.findOne({ user_id: user._id });
      if (!wallet) {
        console.log(`No wallet found for user ${user._id}`);
        continue;
      }

      const userCreatedAt = new Date(user.createdAt);
      console.log(`User ${user._id} - Created At: ${user.createdAt}`);
      const daysSinceCreation = (currentDate - userCreatedAt) / (1000 * 60 * 60 * 24); // Convert milliseconds to days


      // CÓ THỂ ẨN CÁI NÀY ĐỂ TEST
      const isFirstMonthFree = daysSinceCreation <= 30; // Free for the first 30 days
      if (isFirstMonthFree) {
        console.log(`Skipping user ${user._id} - First month free (${Math.floor(daysSinceCreation)} days since creation)`);
        continue;
      }

      const existingTransaction = await Transaction.findOne({
        wallet_id: wallet._id,
        transactionType: "payment",
        content: "Thanh toán phí thành viên hàng tháng",
        createdAt: { $gte: startOfMonth },
      });
      console.log(`Existing transaction for user ${user._id}:`, existingTransaction);

      if (existingTransaction) {
        console.log(`Skipping user ${user._id} - Transaction already exists for this month`);
        continue;
      }

      console.log(`User ${user._id} - Balance: ${wallet.balance}, Monthly Fee: ${MONTHLY_FEE}`);
      if (wallet.balance >= MONTHLY_FEE) {
        console.log(`Deducting fee for user ${user._id}`);
        try {
          wallet.balance -= MONTHLY_FEE;
          await wallet.save();
          console.log(`Wallet updated for user ${user._id}`);
        } catch (walletError) {
          console.error(`Failed to update wallet for user ${user._id}:`, walletError);
          continue;
        }

        const transaction = new Transaction({
          wallet_id: wallet._id,
          payCode: `VIPFEE-${Date.now()}`,
          amount: MONTHLY_FEE,
          status: 1,
          transactionType: "payment",
          content: "Thanh toán phí thành viên hàng tháng",
          balanceAfterTransact: wallet.balance,
        });

        try {
          await transaction.save();
          console.log(`Transaction saved for user ${user._id}`);
        } catch (transactionError) {
          console.error(`Failed to save transaction for user ${user._id}:`, transactionError);
          continue;
        }

        try {
          await sendEmail(
            user.email,
            "Thanh toán thành công",
            `<p>Chào ${user.firstName} ${user.lastName},</p>
            <p>Bạn đã thanh toán thành công phí tháng này với số tiền <strong>${MONTHLY_FEE} VND</strong>.</p>
            <p>Số dư còn lại trong ví: <strong>${wallet.balance} VND</strong>.</p>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>`
          );
        } catch (emailError) {
          console.error(`Failed to send success email to ${user.email}:`, emailError);
        }
      } else {
        console.log(`Insufficient balance for user ${user._id}`);
        try {
          await sendEmail(
            user.email,
            "Cảnh báo: Không đủ số dư thanh toán",
            `<p>Chào ${user.firstName} ${user.lastName},</p>
            <p>Bạn chưa thanh toán phí tháng này (<strong>${MONTHLY_FEE} VND</strong>) do số dư ví không đủ.</p>
            <p>Vui lòng nạp tiền vào ví để duy trì trạng thái của bạn.</p>`
          );
        } catch (emailError) {
          console.error(`Failed to send warning email to ${user.email}:`, emailError);
        }

        // Kiểm tra nếu đã gửi email cảnh báo và 1 ngày đã trôi qua nhưng người dùng chưa nạp tiền
        const warningDelay = 24 * 60 * 60 * 1000; 
        const lastTransaction = await Transaction.findOne({
          wallet_id: wallet._id,
          transactionType: "payment",
          content: "Thanh toán phí thành viên hàng tháng",
          createdAt: { $gte: currentDate - warningDelay }, // Tìm giao dịch trong vòng 1 ngày
        });

        // Nếu không có giao dịch nào trong 1 ngày, tiến hành khoá tài khoản người dùng
        if (!lastTransaction) {
          console.log(`User ${user._id} - Locking account due to no deposit after warning`);
          user.status = 'Banned';  // Khoá tài khoản
          await user.save();
          console.log(`User ${user._id} account has been banned`);
        }
      }
    }
    console.log('Chạy xong');
  } catch (error) {
    console.error("Error in processMonthlyFee:", error.message, error.stack);
  }
};


// CÓ THỂ CHỈNH VỀ EVERY_MINUTE ĐỂ TEST
cron.schedule(CRON_TIME.EVERY_MONTH, processMonthlyFee, {
  scheduled: true,
  timezone: "Asia/Ho_Chi_Minh",
});

module.exports = processMonthlyFee;