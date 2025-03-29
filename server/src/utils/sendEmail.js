const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Email đã gửi thành công tới ${to}`);
    } catch (error) {
        console.error(`❌ Lỗi gửi email tới ${to}:`, error);
    }
};

module.exports = { transporter, sendEmail };
