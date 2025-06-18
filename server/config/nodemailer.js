import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export default transporter;



// console.log("⏩ SMTP CONFIG:");
// console.log("HOST:", process.env.SMTP_HOST);
// console.log("PORT:", process.env.SMTP_PORT);
// console.log("USER:", process.env.SMTP_USER);
