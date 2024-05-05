import dotenv from 'dotenv'
dotenv.config()

const config = {
    DATABASE_URI: process.env.DATABASE_URI,
    GOOGLE: {
        CLIENTID: process.env.GOOGLE_CLENTID,
        CLIENTSECRET: process.env.CLIENTSECRET,
        CALLBACKURL: process.env.CALLBACKURL
    }
}

export default config