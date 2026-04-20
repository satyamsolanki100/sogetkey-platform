import nodemailer from "nodemailer";

/**
 * Send email utility (OTP / notifications)
 */
const sendEmail = async ({ to, subject, text }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password recommended
      },
    });

    await transporter.sendMail({
      from: `"SoGetkey" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Email service error");
  }
};

export default sendEmail;
