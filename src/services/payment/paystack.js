import config from "../../utils/config";
import { logger } from "../../utils/logger";
import axios from 'axios'


/**
 * Provides functionality for interacting with the Paystack payment gateway.
 */
export class Paystack {

    /**
 * Initializes a Paystack transaction.
 *
 * @param {Object} data - The transaction data.
 * @param {number} data.amount - The transaction amount.
 * @param {string} data.email - The customer's email address.
 * @returns {Promise<{ checkout: string } | { status: boolean }>} - The transaction initialization response.
 */
    static async createTransaction(data) {
        try {
            const response = await axios.post('https://api.paystack.co/transaction/initialize', {
                amount: data.amount,
                email: data.email
            }, {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${config.PAYSTACK.SECRETkEY}`
                }
            })
            if (response && response.status === 200) {
                return { checkout: data.authorization_url }
            }
            return null;

        } catch (err) {
            logger.error(err.message)
        }
    }

    /**
 * Verifies a Paystack transaction by making a request to the Paystack API.
 *
 * @param {string} refrence - The reference of the transaction to verify.
 * @returns {Promise<{ status: boolean }>} - An object with a `status` property indicating whether the transaction was successfully verified.
 */
    static async verifyTransaction(refrence) {
        try {
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${refrence}`, {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${config.PAYSTACK.SECRETkEY}`
                }
            })
            if (response && response.status === 200) {
                return { status: true }
            }
            return null

        } catch (err) {
            logger.error(err.message)
        }
    }
}
