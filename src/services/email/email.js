import nodemailer from "nodemailer";
import EventEmitter from "node:events";
import { logger } from "../../utils/logger.js";
export const emailEvent = new EventEmitter();

/**
 * Listens for the "send-email" event and sends an email based on the provided data.
 *
 * @param {Object} data - An object containing email data.
 * @param {string} data.to - The recipient's email address.
 * @param {string} data.subject - The subject of the email.
 * @param {string} data.html - The HTML content of the email.
 * @param {string} [data.emailType] - Optional: The type of email to send. Valid types are "verifyAccount" and "ForgotPassword".
 * @emits {error} - Emits an error event if there's an issue sending the email.
 */
emailEvent.on("send-email", async function (data) {
  const transport = nodemailer.createTransport({
    host: "",
    port: 587,
    secure: false,
    auth: {
      user: "",
      pass: "",
    },
  });

  async function sendMail(emailData) {
    try {
      const info = await transport.sendMail({
        from: '',
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      });
      logger.info("Message sent: %s", info.messageId);
    } catch (err) {
      logger.error("Error sending email:", err.message);
    }
  }

  try {
    switch (data.emailType) {
      case "verifyAccount":
        await sendMail(data);
        break;

      case "ForgotPassword":
        await sendMail(data);
        break;

      default:
        logger.error("Invlalid email type", data.emailType);
        break;
    }
  } catch (err) {
    logger.error("Error sending email:", err.message);
  }
});
