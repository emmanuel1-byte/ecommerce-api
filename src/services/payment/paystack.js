import config from "../../utils/config.js";
import { logger } from "../../utils/logger.js";
import axios from "axios";

export class PayStack {
  static async createTransaction(data) {
    try {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          amount: data.amount,
          email: data.email,
        },
        { headers: { Authorization: `Bearer ${config.PAYSTACK.SECRETkEY}` } }
      );
      return response.data.data.authorization_url;
    } catch (err) {
      logger.error(err.stack);
    }
  }

  static async verifyTransaction(refrence) {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/:${refrence}`,
        { headers: { Authorization: `Bearer ${config.PAYSTACK.SECRETkEY}` } }
      );
      if (!response.data.status === false) {
        return response.data.message;
      }
      return response.data.message;
    } catch (err) {
      logger.error(err.stack);
    }
  }
}
