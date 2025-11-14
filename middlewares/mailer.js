const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   
    pass: process.env.EMAIL_PASSWORD, 
  },
});

async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Daddo" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email enviado!");
  } catch (error) {
    console.error("Error enviando email:", error);
  }
}

module.exports = sendEmail;
