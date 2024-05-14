import nodemailer from "nodemailer";
import EventEmitter from "node:events";
import { logger } from "../../utils/logger.js";
import config from "../../utils/config.js";
export const emailEvent = new EventEmitter();

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
    user: config.GOOGLE.USER,
    pass: config.GOOGLE.PASSWORD,
  },
});



/**
 * Emits an "accountVerificationEmail" event with the provided request, email, and token.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} email - The email address to send the verification email to.
 * @param {string} token - The token to include in the verification email link.
 */
export function sendVerifcationEmail(req, email, token) {
  emailEvent.emit("accountVerificationEmail", req, email, token)
}


/**
 * Sends an email to a user to confirm their account by providing a verification token.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} email - The email address of the user to send the verification email to.
 * @param {string} token - The verification token to include in the email link.
 */
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


/**
 * Sends a reset password email to the specified email address.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} email - The email address to send the reset password email to.
 * @param {string} token - The password reset token to include in the email link.
 */
export function sendResetPasswordEmail(req, email, token) {
  emailEvent.emit("resetPasswordEmail", req, email, token)
}


/**
 * Sends a reset password email to the specified email address.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} email - The email address to send the reset password email to.
 * @param {string} token - The password reset token to include in the email link.
 */
emailEvent.on(
  "resetPasswordEmail",
  async function ResetPasswordEmail(req, email, token) {
    try {
      const info = await transport.sendMail({
        from: config.GOOGLE.USER,
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
