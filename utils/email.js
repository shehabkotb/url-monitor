const config = require("../config/config");
const nodemailer = require("nodemailer");

const sendEmail = async (emailTo, subject, emailHtml) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: config.APP_EMAIL,
      pass: config.APP_EMAIL_PASS,
    },
  });

  // Send email with verification link
  const info = await transporter.sendMail({
    from: config.APP_EMAIL,
    to: emailTo,
    subject: subject,
    html: emailHtml,
  });

  console.log(`Message sent: ${info.messageId}`);
};

module.exports = sendEmail;
