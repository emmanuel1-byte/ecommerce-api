import nodemailer from "nodemailer";
import EventEmitter from "node:events";
import { logger } from "../../utils/logger.js";
import config from "../../utils/config.js";
const {  GOOGLE, } = config;
const emailEvent = new EventEmitter();

/**
 * Creates a nodemailer transport instance for sending emails using Gmail.
 * The transport is configured with the Gmail service, port 465, and secure connection.
 * The authentication credentials are provided from the `config.GOOGLE` object.
 */
const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: false,
  auth: {
    user: GOOGLE.USER,
    pass: GOOGLE.PASSWORD,
  },
});




export function sendVerifcationEmail(req, email, token) {
  emailEvent.emit("accountVerificationEmail", req, email, token)
}


emailEvent.on(
  "accountVerificationEmail", async (req, email, token) => {
    try {
      const info = await transport.sendMail({
        from: GOOGLE.USER,
        to: email,
        subject: "Confirm Your Account",
        html: `Please click the link below to confirm your email address <a href=${`${req.protocol}://${req.hostname}/v1/auth/verify?token=${token}`}>Click here to confirm your email address</a>`,
      });
      logger.info(`Message sent: %s ${info.messageId}`);
    } catch (err) {
      logger.error(`Error sending email: ${err.message}`);
    }
  }
);




export function sendResetPasswordEmail(req, email, token) {
  emailEvent.emit("resetPasswordEmail", req, email, token)
}


emailEvent.on(
  "resetPasswordEmail", async (req, email, token) => {
    try {
      const info = await transport.sendMail({
        from: GOOGLE.USER,
        to: email,
        subject: "Reset Password",
        html: `<a href=${`${req.protocol}://${req.hostname}/v1/auth/verify-password-reset-token?token=${token}`}> click the link  to reset your password </a>`,
      });
      logger.info(`Message sent: %s ${info.messageId}`);
    } catch (err) {
      logger.error(`Error sending email: ${err.message}`);
    }
  }
);
