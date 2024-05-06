import nodemailer from "nodemailer";
import EventEmitter from "node:events";
import { logger } from "../../utils/logger.js";
import config from "../../utils/config.js";
export const emailEvent = new EventEmitter();

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: false,
  auth: {
    user: config.GOOGLE.USER,
    pass: config.GOOGLE.PASSWORD,
  },
});


/** Emitters */
export function sendVerifcationEmail(req, email, token) {
  emailEvent.emit("accountVerificationEmail", req, email, token)
}


emailEvent.on(
  "accountVerificationEmail",
  async (req, email, token) => {
    try {
      const info = await transport.sendMail({
        from: config.GOOGLE.USER,
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
  "resetPasswordEmail",
  async function ResetPasswordEmail(req, email, token) {
    try {
      const info = await transport.sendMail({
        from: config.GOOGLE.USER,
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
