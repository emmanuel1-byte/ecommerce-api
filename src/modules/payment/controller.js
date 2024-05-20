import { Paystack } from "../../services/payment/paystack"



async function makePayment(req, res, next) {
    try {
        const validatedData = ''
        const initiatePayment = await Paystack.createTransaction(validatedData)
        await ''
        res.redirect(initiatePayment.checkout)
    } catch (err) {
        next(err)
    }
}

async function verifyPayment(req, res, next) {
    try {
        const verifyPaymentPayload = ''


    } catch (err) {
        next(err)
    }
}