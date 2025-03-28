const nodemailer = require('nodemailer'); // Import nodemailer để gửi email

const MONTHLY_FEE = 100000; // 100,000 VND per month

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password',
  },
});

const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail(mailOptions);
};

module.exports = { MONTHLY_FEE, transporter, sendEmail };

