// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import { ApiError } from "./ApiError.js";

// dotenv.config();

// console.log("SMTP HOST:", process.env.BREVO_HOST);


// const transporter = nodemailer.createTransport({
//   host: process.env.BREVO_HOST || `smtp-relay.brevo.com`,
//   port: Number(process.env.BREVO_PORT) || 587,
//   secure: false, // use STARTTLS (true = SSL, only if you use port 465)
//   auth: {
//     user: process.env.BREVO_USER,
//     pass: process.env.BREVO_PASS,
//   },
// });

// /**
//  * Sends an email using Brevo SMTP.
//  * @param {string} to - recipient email
//  * @param {string} subject - subject line
//  * @param {string} text - plain text version
//  * @param {string} html - HTML version
//  */
// export const sendEmail = async (to, subject, text, html) => {
//   try {
//     console.log("🚀 BREVO_HOST:", process.env.BREVO_HOST);
//     console.log("🚀 BREVO_USER:", process.env.BREVO_USER);

//     const info = await transporter.sendMail({
//       from: process.env.BREVO_FROM,
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log(`✅ Email sent successfully to ${to}`);
//     return info;
//   } catch (error) {
//     console.error("❌ Email sending failed:", error);
//     throw new ApiError(500, `Failed to send email to ${to}: ${error.message}`);
//   }
// };


import dotenv from "dotenv";
import { ApiError } from "./ApiError.js";
import fetch from "node-fetch";

dotenv.config();

/**
 * Sends an email using Brevo API (works on Render).
 * @param {string} to - recipient email
 * @param {string} subject - subject line
 * @param {string} text - plain text version
 * @param {string} html - HTML version
 */
export const sendEmail = async (to, subject, text, html) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "ResolveX", email: "hbro2126@gmail.com" },
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Email sending failed:", data);
      throw new ApiError(500, `Failed to send email: ${data.message || "Unknown error"}`);
    }

    console.log(`✅ Email sent successfully to ${to}`);
    return data;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new ApiError(500, `Failed to send email to ${to}: ${error.message}`);
  }
};
