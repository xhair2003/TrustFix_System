const cron = require("node-cron");
const { User, Wallet, Transaction } = require("../models");
const {CRON_TIME} = require("../constants");

const processMonthlyFee = async () => {
  try {
    console.log("Đang chạy cron job tính phí hằng tháng...");
    
    const users = await User.find();
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    for (const user of users) {
      const wallet = await Wallet.findOne({ user_id: user._id });
      if (!wallet) {
        continue;
      }

      const userCreatedAt = new Date(user.createdAt);
      const isFirstMonthFree =
        currentDate.getMonth() === userCreatedAt.getMonth() &&
        currentDate.getFullYear() === userCreatedAt.getFullYear();

      if (isFirstMonthFree) {
        continue;
      }

      const existingTransaction = await Transaction.findOne({
        wallet_id: wallet._id,
        transactionType: "payment",
        content: "Thanh toán phí thành viên hàng tháng",
        createdAt: { $gte: startOfMonth },
      });

      if (existingTransaction) {
        continue;
      }

      if (wallet.balance >= MONTHLY_FEE) {
        wallet.balance -= MONTHLY_FEE;
        await wallet.save();

        const transaction = new Transaction({
          wallet_id: wallet._id,
          payCode: `VIPFEE-${Date.now()}`,
          amount: MONTHLY_FEE,
          status: 1,
          transactionType: "payment",
          content: "Thanh toán phí thành viên hàng tháng",
          balanceAfterTransact: wallet.balance,
        });

        await transaction.save();

        await sendEmail(
          user.email,
          "Thanh toán thành công",
          `<p>Chào ${user.firstName} ${user.lastName},</p>
          <p>Bạn đã thanh toán thành công phí tháng này với số tiền <strong>${MONTHLY_FEE} VND</strong>.</p>
          <p>Số dư còn lại trong ví: <strong>${wallet.balance} VND</strong>.</p>
          <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>`
        );

      } else {
        await sendEmail(
          user.email,
          "Cảnh báo: Không đủ số dư thanh toán",
          `<p>Chào ${user.firstName} ${user.lastName},</p>
          <p>Bạn chưa thanh toán phí tháng này (<strong>${MONTHLY_FEE} VND</strong>) do số dư ví không đủ.</p>
          <p>Vui lòng nạp tiền vào ví để duy trì trạng thái của bạn.</p>`
        );

      }
    }

  } catch (error) {
    console.error(error);
  }
};

cron.schedule(CRON_TIME.EVERY_MONTH, processMonthlyFee, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh",
  });
  
module.exports = processMonthlyFee;
