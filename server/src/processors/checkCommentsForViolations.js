// const cron = require('node-cron');
// const mongoose = require('mongoose');
// const { ForumComment, Violation } = require('../models');
// const { CRON_TIME } = require('../constants');
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Patterns to detect prohibited content
// const prohibitedPatterns = [
//   /\b(\d{10}|\d{3}-\d{3}-\d{4}|\d{3}\.\d{3}\.\d{4})\b/, // Phone numbers
//   /(https?:\/\/[^\s]+)/i, // URLs
//   /\b(số nhà|đường|phố|quận|huyện|thành phố|tp\.|tỉnh)\b/i, // Address keywords
//   /\b(điện|fb|web|số điện thoại|số|điện thoại|sửa chữa|liên hệ|đặt lịch|thuê|ngoài hệ thống|chợ tốt|facebook|website)\b/i, // Solicitation keywords
// ];

// // Function to check comments and handle violations
// const checkCommentsForViolations = async () => {
//   try {
//     console.log('Starting comment violation check...');

//     // Check MongoDB connection
//     if (mongoose.connection.readyState !== 1) {
//       console.error('MongoDB connection is not active');
//       return;
//     }

//     console.log('Fetching comments...');
//     const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
//     const comments = await ForumComment.find({ createdAt: { $gte: oneHourAgo } }).populate('user_id');
//     console.log(`Found ${comments.length} comments`);

//     for (const comment of comments) {
//       console.log(`Checking comment ${comment._id} by user ${comment.user_id?._id}`);
//       const content = comment.content;
//       const user = comment.user_id;

//       // Validate user
//       if (!user || user.status === 'Banned') {
//         console.log(`Skipping comment ${comment._id}: Invalid user or banned`);
//         continue;
//       }

//       // Validate user email
//       if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
//         console.log(`Invalid or missing email for user ${user._id}`);
//         continue;
//       }

//       // Check for prohibited content
//       const isProhibited = prohibitedPatterns.some((pattern) => pattern.test(content));
//       if (isProhibited) {
//         console.log(`Violation detected in comment ${comment._id}`);
//         const violation = new Violation({
//           user_id: user._id,
//           comment_id: comment._id,
//           content: content,
//         });
//         await violation.save();
//         console.log(`Violation saved for user ${user._id}`);

//         await ForumComment.deleteOne({ _id: comment._id });
//         console.log(`Comment ${comment._id} deleted`);

//         const violationCount = await Violation.countDocuments({ user_id: user._id });
//         console.log(`User ${user._id} has ${violationCount} violations`);

//         if (violationCount === 1) {
//           const mailOptions = {
//             from: process.env.EMAIL_USER,
//             to: user.email,
//             subject: 'Cảnh báo vi phạm quy định cộng đồng TrustFix',
//             html: `
//               <h1>Cảnh báo vi phạm</h1>
//               <p>Chào ${user.firstName} ${user.lastName},</p>
//               <p>Bình luận của bạn trên TrustFix đã bị xóa vì vi phạm quy định cộng đồng:</p>
//               <blockquote><strong>${content}</strong></blockquote>
//               <p>Lý do: Nội dung chứa thông tin liên lạc hoặc lôi kéo tìm thợ ngoài hệ thống.</p>
//               <p>Nếu bạn tiếp tục vi phạm, tài khoản của bạn sẽ bị khóa vĩnh viễn.</p>
//               <p>Vui lòng xem lại <a href="https://trustfix.com/community-guidelines" style="color: #007bff; text-decoration: none;">Quy định cộng đồng</a>.</p>
//               <p>Trân trọng,</p>
//               <p>Đội ngũ TrustFix</p>
//             `,
//           };
//           try {
//             await transporter.sendMail(mailOptions);
//             console.log(`Warning email sent to ${user.email}`);
//           } catch (emailError) {
//             console.error(`Failed to send warning email to ${user.email}:`, emailError);
//           }
//         } else if (violationCount >= 2) {
//           user.status = 'Banned';
//           await user.save();
//           console.log(`User ${user._id} banned`);

//           const banMailOptions = {
//             from: process.env.EMAIL_USER,
//             to: user.email,
//             subject: 'Tài khoản TrustFix của bạn đã bị khóa',
//             html: `
//               <h1>Thông báo khóa tài khoản</h1>
//               <p>Chào ${user.firstName} ${user.lastName},</p>
//               <p>Tài khoản của bạn đã bị khóa vì lý do:</p>
//               <blockquote><strong>Vi phạm quy định cộng đồng lần thứ hai: Nội dung bình luận lôi kéo tìm thợ ngoài hệ thống.</strong></blockquote>
//               <p>Nếu bạn có thắc mắc, vui lòng liên hệ đội ngũ hỗ trợ qua email: 
//                   <a href="mailto:admin@trustfix.com" style="color: #007bff; text-decoration: none;">
//                       admin@trustfix.com
//                   </a>
//               </p>
//               <p>Trân trọng,</p>
//               <p>Đội ngũ TrustFix</p>
//             `,
//           };
//           try {
//             await transporter.sendMail(banMailOptions);
//             console.log(`Ban email sent to ${user.email}`);
//           } catch (emailError) {
//             console.error(`Failed to send ban email to ${user.email}:`, emailError);
//           }
//         }
//       }
//     }

//     console.log('Comment violation check completed.');
//   } catch (error) {
//     console.error('Error in comment violation check:', error.stack);
//   }
// };

// cron.schedule(CRON_TIME.EVERY_MINUTE, checkCommentsForViolations, {
//   scheduled: true,
//   timezone: 'Asia/Ho_Chi_Minh',
// });


// backend/processors/checkCommentsForViolations.js
const cron = require('node-cron');
const mongoose = require('mongoose');
const { ForumComment, Violation } = require('../models');
const { CRON_TIME } = require('../constants');
const { sendEmail } = require('../utils/sendEmail');

module.exports = (io) => {
  console.log('Check comments cron file loaded');

  // Patterns to detect prohibited content
  const prohibitedPatterns = [
    /\b(\d{10}|\d{3}-\d{3}-\d{4}|\d{3}\.\d{3}\.\d{4})\b/,
    /(https?:\/\/[^\s]+)/i,
    /\b(số nhà|đường|phố|quận|huyện|thành phố|tp\.|tỉnh)\b/i,
    /\b(điện|fb|web|số điện thoại|số|điện thoại|sửa chữa|liên hệ|đặt lịch|thuê|ngoài hệ thống|chợ tốt|facebook|website)\b/i,
  ];

  // Function to check comments and handle violations
  const checkCommentsForViolations = async () => {
    try {
      console.log('Starting comment violation check...');

      // Check MongoDB connection
      if (mongoose.connection.readyState !== 1) {
        console.error('MongoDB connection is not active');
        return;
      }

      console.log('Fetching comments...');
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const comments = await ForumComment.find({ createdAt: { $gte: oneHourAgo } }).populate('user_id');
      console.log(`Found ${comments.length} comments`);

      for (const comment of comments) {
        console.log(`Checking comment ${comment._id} by user ${comment.user_id?._id}`);
        const content = comment.content;
        const user = comment.user_id;

        // Validate user
        if (!user || user.status === 'Banned') {
          console.log(`Skipping comment ${comment._id}: Invalid user or banned`);
          continue;
        }

        // Validate user email
        if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
          console.log(`Invalid or missing email for user ${user._id}`);
          continue;
        }

        // Check for prohibited content
        const isProhibited = prohibitedPatterns.some((pattern) => pattern.test(content));
        if (isProhibited) {
          console.log(`Violation detected in comment ${comment._id}`);
          const violation = new Violation({
            user_id: user._id,
            comment_id: comment._id,
            content: content,
          });
          await violation.save();
          console.log(`Violation saved for user ${user._id}`);

          await ForumComment.deleteOne({ _id: comment._id });
          console.log(`Comment ${comment._id} deleted`);

          const violationCount = await Violation.countDocuments({ user_id: user._id });
          console.log(`User ${user._id} has ${violationCount} violations`);

          if (violationCount === 1) {
            try {
              await sendEmail(
                user.email,
                'Cảnh báo vi phạm quy định cộng đồng TrustFix',
                `
                  <h1>Cảnh báo vi phạm</h1>
                  <p>Chào ${user.firstName} ${user.lastName},</p>
                  <p>Bình luận của bạn trên TrustFix đã bị xóa vì vi phạm quy định cộng đồng:</p>
                  <blockquote><strong>${content}</strong></blockquote>
                  <p>Lý do: Nội dung chứa thông tin liên lạc hoặc lôi kéo tìm thợ ngoài hệ thống.</p>
                  <p>Nếu bạn tiếp tục vi phạm, tài khoản của bạn sẽ bị khóa vĩnh viễn.</p>
                  <p>Vui lòng xem lại <a href="https://trustfix.com/community-guidelines" style="color: #007bff; text-decoration: none;">Quy định cộng đồng</a>.</p>
                  <p>Trân trọng,</p>
                  <p>Đội ngũ TrustFix</p>
                `
              );
              console.log(`Warning email sent to ${user.email}`);
            } catch (emailError) {
              console.error(`Failed to send warning email to ${user.email}:`, emailError);
            }
          } else if (violationCount >= 2) {
            user.status = 'Banned';
            await user.save();
            console.log(`User ${user._id} banned`);

            // Emit Socket.IO event
            if (!io) {
              console.error('Socket.IO instance not available for emitting userBanned event');
            } else {
              console.log(`Emitting userBanned event to room ${user._id}`);
              io.to(user._id.toString()).emit('userBanned', {
                message: 'Tài khoản của bạn đã bị khóa do vi phạm quy định cộng đồng!',
              });
            }

            try {
              await sendEmail(
                user.email,
                'Tài khoản TrustFix của bạn đã bị khóa',
                `
                  <h1>Thông báo khóa tài khoản</h1>
                  <p>Chào ${user.firstName} ${user.lastName},</p>
                  <p>Tài khoản của bạn đã bị khóa vì lý do:</p>
                  <blockquote><strong>Vi phạm quy định cộng đồng lần thứ hai: Nội dung bình luận lôi kéo tìm thợ ngoài hệ thống.</strong></blockquote>
                  <p>Nếu bạn có thắc mắc, vui lòng liên hệ đội ngũ hỗ trợ qua email: 
                      <a href="mailto:admin@trustfix.com" style="color: #007bff; text-decoration: none;">
                          admin@trustfix.com
                      </a>
                  </p>
                  <p>Trân trọng,</p>
                  <p>Đội ngũ TrustFix</p>
                `
              );
              console.log(`Ban email sent to ${user.email}`);
            } catch (emailError) {
              console.error(`Failed to send ban email to ${user.email}:`, emailError);
            }
          }
        }
      }

      console.log('Comment violation check completed.');
    } catch (error) {
      console.error('Error in comment violation check:', error.stack);
    }
  };

  // Schedule cron job
  console.log('CRON_TIME.EVERY_MINUTE:', CRON_TIME.EVERY_MINUTE);
  const job = cron.schedule(CRON_TIME.EVERY_MINUTE, checkCommentsForViolations, {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh',
  });
  console.log('Cron job scheduled:', job);

  // Optional manual trigger for testing
  const triggerCommentCheck = async (req, res) => {
    try {
      await checkCommentsForViolations();
      res.status(200).json({
        EC: 1,
        EM: 'Kiểm tra bình luận vi phạm hoàn tất!',
        DT: '',
      });
    } catch (error) {
      res.status(500).json({
        EC: 0,
        EM: 'Lỗi khi kiểm tra bình luận!',
        DT: error.message,
      });
    }
  };

  return { checkCommentsForViolations, triggerCommentCheck };
};