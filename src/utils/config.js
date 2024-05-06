import dotenv from 'dotenv'
dotenv.config()

const config = {
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URI: process.env.DATABASE_URI,
    GOOGLE: {
        CLIENTID: process.env.GOOGLE_CLENTID,
        CLIENTSECRET: process.env.CLIENTSECRET,
        CALLBACKURL: process.env.CALLBACKURL,
        PASSWORD: process.env.GOOGLE_PASSWORD,
        USER: process.env.GOOGLE_USER
    }
}

export default config