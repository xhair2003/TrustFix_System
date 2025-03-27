<<<<<<< Updated upstream
import nodemailer from 'nodemailer'; // Import nodemailer để gửi email

export const MONTHLY_FEE = 100000; // 100,000 VND per month

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent
    };

    await transporter.sendMail(mailOptions);
};
=======
const MONTHLY_FEE = 100000;

const CRON_TIME = {
    EVERY_MINUTE: "* * * * *",          // Chạy mỗi phút
    EVERY_HOUR: "0 * * * *",            // Chạy mỗi giờ
    EVERY_DAY_AT_MIDNIGHT: "0 0 * * *", // Chạy mỗi ngày vào 00:00
    EVERY_WEEK: "0 0 * * 0",            // Chạy mỗi tuần vào Chủ Nhật lúc 00:00
    EVERY_MONTH: "0 0 1 * *",           // Chạy vào 00:00 ngày 1 hàng tháng
    EVERY_YEAR: "0 0 1 1 *"             // Chạy vào ngày 1 tháng 1 hàng năm
};

module.exports = { MONTHLY_FEE, CRON_TIME};
>>>>>>> Stashed changes
