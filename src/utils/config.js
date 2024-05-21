import dotenv from 'dotenv'
dotenv.config()

/**
 * Defines the configuration settings for the application, including:
 * - JWT secret key
 * - Database connection URI
 * - Paystack payment gateway settings
 * - Google OAuth2 settings
 * - Cloudinary cloud storage settings
 *
 * These settings are loaded from environment variables.
 */
const config = {
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URI: process.env.DATABASE_URI,
    PAYSTACK: {
        SECRETkEY: process.env.PAYSTACK_SECRET_KEY

    },
    GOOGLE: {
        CLIENTID: process.env.GOOGLE_CLIENTID,
        CLIENTSECRET: process.env.GOOGLE_CLIENTSECRET,
        CALLBACKURL: process.env.GOOGLE_CALLBACK,
        PASSWORD: process.env.GOOGLE_PASSWORD,
        USER: process.env.GOOGLE_USER
    },
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET,
    }
}

export default config