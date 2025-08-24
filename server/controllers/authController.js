import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

import transporter from '../config/nodemailer.js';
import userModel from '../models/User.js';


export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing details" });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name, email, password: hashedPassword
        });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // Sending welcome mail
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to NotARealCompany",
            text: `Welcome to NotARealCompany\nYour account has been create with the email id: ${email}`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.error("Mail Error:", err.message);
        }

        return res.json({ success: true, message: "User registered successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message: "Login successful" })

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message: "Logged out" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const sendVerifyOTP = async (req, res) => {
    try {

        const userId = req.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.json({ success: false, message: "Invalid user ID" });
        }

        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOTP = otp;
        user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. Verify your account using this OTP in 24 hrs.`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.error("Mail Error:", err.message);
        }

        return res.json({ success: true, message: "Verification OTP sent to email." });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const userId = req.userId;
    const { otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: "Missing credentials" });
    }
    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found!" });
        }

        if (user.verifyOTP === "" | user.verifyOTP !== otp) {
            return res.json({ success: false, message: "Invalid OTP!" });
        }

        if (user.verifyOTPExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired!" });
        }

        user.isAccountVerified = true;
        user.verifyOTP = '';
        user.verifyOTPExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: "Email verified successfully!" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const sendResetOTP = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: "Email is required!" });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found!" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        user.resetOTP = otp;
        user.resetOTPExpireAt = Date.now() + (15 * 60 * 1000);
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for resetting your password is ${otp}. Use this password to proceed with resetting your password.`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.error("Mail Error:", err.message);
        }

        return res.json({ success: true, message: "Reset OTP sent to your email." });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP and new password are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.resetOTP === "" || user.resetOTP !== otp.toString()) {
            return res.json({ success: false, message: "Invalid OTP!" });
        }

        if (user.resetOTPExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired!" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOTP = '';
        user.resetOTPExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: "Password has been reset successfully!" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};