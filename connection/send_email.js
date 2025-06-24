const nodemailer = require("nodemailer");
const sendEmail = async (to, subject, html) => {
  console.log(`email-> ${process.env.USER_EMAIL}`);
  console.log(`password->${process.env.USER_PASS}`);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  console.log("sending mail", to);

  await transporter.sendMail({
    from: `"Codec App" <${process.env.USER_EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
