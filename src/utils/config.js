import dotenv from 'dotenv'
dotenv.config()

const config = {
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URI: process.env.DATABASE_URI,
    GOOGLE: {
        CLIENTID: process.env.GOOGLE_CLIENTID,
        CLIENTSECRET: process.env.GOOGLE_CLIENTSECRET,
        CALLBACKURL: process.env.GOOGLE_CALLBACK,
        PASSWORD: process.env.GOOGLE_PASSWORD,
        USER: process.env.GOOGLE_USER
    }
}

export default config