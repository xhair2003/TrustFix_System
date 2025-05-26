const cron = require('node-cron');
const mongoose = require('mongoose');
const { User, Wallet, Transaction } = require('../models');
const { CRON_TIME, MONTHLY_FEE } = require('../constants');
const { sendEmail } = require('../utils/sendEmail');
const checkRepairmanStatus = require('./checkRepairmanStatus');

module.exports = (io) => {
  console.log('Monthly fee processor loaded');

  const processMonthlyFee = async () => {
    try {
      console.log('Đang chạy cron job tính phí hằng tháng...');

      // Check MongoDB connection
      if (mongoose.connection.readyState !== 1) {
        console.error('MongoDB connection is not active');
        return;
      }

      const users = await User.find();
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

      for (const user of users) {
        // Skip banned users
        if (user.status === 'Banned') {
          console.log(`Skipping user ${user._id} - Account already banned`);
          continue;
        }

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
        console.log(`User ${user._id} - Created At: ${userCreatedAt}`);
        const daysSinceCreation = (currentDate - userCreatedAt) / (1000 * 60 * 60 * 24);

        // CÓ THỂ ẨN CÁI NÀY ĐỂ TEST
        // const isFirstMonthFree = daysSinceCreation <= 30;
        // if (isFirstMonthFree) {
        //   console.log(
        //     `Skipping user ${user._id} - First month free (${Math.floor(daysSinceCreation)} days since creation)`
        //   );
        //   continue;
        // }

        const existingTransaction = await Transaction.findOne({
          wallet_id: wallet._id,
          transactionType: 'payment',
          content: 'Thanh toán phí thành viên hàng tháng',
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
            transactionType: 'payment',
            content: 'Thanh toán phí thành viên hàng tháng',
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
              'Thanh toán thành công',
              `<p>Chào ${user.firstName} ${user.lastName},</p>
              <p>Bạn đã thanh toán thành công phí tháng này với số tiền <strong>${MONTHLY_FEE} VND</strong>.</p>
              <p>Số dư còn lại trong ví: <strong>${wallet.balance} VND</strong>.</p>
              <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>`
            );
            console.log(`Success email sent to ${user.email}`);
          } catch (emailError) {
            console.error(`Failed to send success email to ${user.email}:`, emailError);
          }
        } else {
          console.log(`Insufficient balance for user ${user._id}`);

          // Kiểm tra xem đã gửi email cảnh báo hoặc có giao dịch thanh toán trong tháng này chưa
          const lastTransactionOrWarning = await Transaction.findOne({
            wallet_id: wallet._id,
            transactionType: { $in: ['payment', 'warning'] },
            content: { $in: ['Thanh toán phí thành viên hàng tháng', 'Cảnh báo: Không đủ số dư thanh toán'] },
            createdAt: { $gte: startOfMonth },
          });

          if (!lastTransactionOrWarning) {
            // Gửi email cảnh báo lần đầu
            try {
              await sendEmail(
                user.email,
                'Cảnh báo: Không đủ số dư thanh toán',
                `<p>Chào ${user.firstName} ${user.lastName},</p>
                <p>Bạn chưa thanh toán phí tháng này (<strong>${MONTHLY_FEE} VND</strong>) do số dư ví không đủ.</p>
                <p>Vui lòng nạp tiền vào ví để duy trì trạng thái của bạn.</p>`
              );
              console.log(`Warning email sent to ${user.email}`);

              // Lưu giao dịch cảnh báo để theo dõi
              const warningTransaction = new Transaction({
                wallet_id: wallet._id,
                payCode: `WARNING-${Date.now()}`,
                amount: 0,
                status: 0,
                transactionType: 'warning',
                content: 'Cảnh báo: Không đủ số dư thanh toán',
                balanceAfterTransact: wallet.balance,
              });
              await warningTransaction.save();
              console.log(`Warning transaction saved for user ${user._id}`);
            } catch (emailError) {
              console.error(`Failed to send warning email to ${user.email}:`, emailError);
            }
          } else if (lastTransactionOrWarning.createdAt < new Date(currentDate - 2 * 60 * 1000)) {
            // Sau 24 giờ mà vẫn không nạp tiền, khóa tài khoản và gửi email thông báo

            // TEST: Sau 2 phút mà vẫn không nạp tiền, khóa tài khoản và gửi email thông báo
            // PRODUCTION: Thay 2 * 60 * 1000 bằng 24 * 60 * 60 * 1000 để trở về 24 giờ
            console.log(`User ${user._id} - Locking account due to no deposit after warning`);
            user.status = 'Banned';
            await user.save();
            console.log(`User ${user._id} account has been banned`);

            try {
              await sendEmail(
                user.email,
                'Thông báo: Tài khoản của bạn đã bị tạm khóa',
                `<p>Chào ${user.firstName} ${user.lastName},</p>
                <p>Rất tiếc, tài khoản của bạn đã bị tạm khóa do không thanh toán phí thành viên hàng tháng (<strong>${MONTHLY_FEE} VND</strong>).</p>
                <p>Vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi qua email trustfix@gmail.com hoặc số điện thoại 0945201693 để được hỗ trợ khôi phục tài khoản.</p>
                <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>`
              );
              console.log(`Ban notification email sent to ${user.email}`);
            } catch (emailError) {
              console.error(`Failed to send ban notification email to ${user.email}:`, emailError);
            }

            if (!io) {
              console.error('Socket.IO instance not available for emitting userBanned event');
            } else {
              console.log(`Emitting userBanned event to room ${user._id}`);
              io.to(user._id.toString()).emit('userBanned', {
                message: 'Tài khoản của bạn đã bị khóa do không thanh toán phí thành viên!',
              });
            }
          }
        }
      }
      console.log('Chạy xong');
    } catch (error) {
      console.error('Error in processMonthlyFee:', error.message, error.stack);
    }
  };

  // Schedule cron job
  console.log('CRON_TIME.EVERY_MONTH:', CRON_TIME.EVERY_MONTH);
  //CRON_TIME.EVERY_MONTH
  const job = cron.schedule(CRON_TIME.EVERY_MONTH, processMonthlyFee, {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh',
  });
  console.log('Cron job scheduled:', job);

  // Schedule the cron job to run every minute
  cron.schedule('* * * * *', async () => {
    console.log('Running checkRepairmanStatus processor...');
    await checkRepairmanStatus();
  });

  return processMonthlyFee;
};