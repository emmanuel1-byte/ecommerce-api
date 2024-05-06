import nodemailer from "nodemailer";
import EventEmitter from "node:events";
import { logger } from "../../utils/logger.js";
export const emailEvent = new EventEmitter();

const transport = nodemailer.createTransport({
  host: "",
  port: 587,
  secure: false,
  auth: {
    user: "",
    pass: "",
  },
});

emailEvent.on(
  "sendVerificationEmail",
  async function sendVerificationEmail(req, email) {
    try {
      const info = await transport.sendMail({
        to: email,
        subject: "Confirm Your Account",
        html: `Please click the link below to confirm your email address <a href=${`${req.protocol}://${req.hostname}/v1/auth/verify?token=${j}`}>Click here to confirm your email address</a>`,
      });
      logger.info("Message sent: %s", info.messageId);
    } catch (err) {
      logger.error("Error sending email:", err.message);
    }
  }
);
