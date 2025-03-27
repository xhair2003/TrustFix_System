const nodemailer = require('nodemailer');

const MONTHLY_FEE = 100000; // Ví dụ

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Hoặc dịch vụ email bạn dùng
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { MONTHLY_FEE, sendEmail };