import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ApiError } from "./ApiError.js";

dotenv.config();

console.log("SMTP HOST:", process.env.BREVO_HOST);


const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: Number(process.env.BREVO_PORT) || 587,
  secure: false, // use STARTTLS (true = SSL, only if you use port 465)
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

/**
 * Sends an email using Brevo SMTP.
 * @param {string} to - recipient email
 * @param {string} subject - subject line
 * @param {string} text - plain text version
 * @param {string} html - HTML version
 */
export const sendEmail = async (to, subject, text, html) => {
  try {
    console.log("🚀 BREVO_HOST:", process.env.BREVO_HOST);
    console.log("🚀 BREVO_USER:", process.env.BREVO_USER);

    const info = await transporter.sendMail({
      from: process.env.BREVO_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log(`✅ Email sent successfully to ${to}`);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new ApiError(500, `Failed to send email to ${to}: ${error.message}`);
  }
};
