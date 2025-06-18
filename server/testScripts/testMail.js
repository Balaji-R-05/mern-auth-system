import dotenv from 'dotenv';
dotenv.config();

import transporter from '../config/nodemailer.js'; // Adjust path if needed

const testMail = async () => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: process.env.TESTER_EMAIL,
            subject: "✅ Brevo SMTP Test Mail",
            text: "If you received this, your Brevo SMTP is working!",
        });

        console.log("✅ Mail sent successfully:", info.messageId);
    } catch (error) {
        console.error("❌ Error sending mail:", error.message);
    }
};
console.log("SMTP Host:", process.env.SMTP_HOST);
testMail();
