const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const createTransporter = () => {
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    return null;
};

const sendEmail = async ({ to, subject, html }) => {
    const transporter = createTransporter();

    if (transporter) {
        try {
            const info = await transporter.sendMail({
                from: process.env.EMAIL_FROM || '"DivyaKarya" <noreply@divyakarya.com>',
                to,
                subject,
                html
            });
            logger.info('Email sent', { messageId: info.messageId, to });
            return true;
        } catch (error) {
            logger.error('Error sending email', error);
            return false;
        }
    } else {
        // Mock email for development
        logger.info('MOCK EMAIL SENDING', {
            to,
            subject,
            html: html.substring(0, 100) + '...' // Log truncated content
        });
        return true;
    }
};

const sendPasswordResetEmail = async (email, resetToken, origin) => {
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;
    const subject = 'Reset Your Password - DivyaKarya';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D97706;">DivyaKarya Password Reset</h2>
            <p>You requested a password reset. Please click the button below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #D97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p><small>This link is valid for 1 hour.</small></p>
        </div>
    `;
    return sendEmail({ to: email, subject, html });
};

const sendVerificationEmail = async (email, verifyToken, origin) => {
    const verifyUrl = `${origin}/verify-email?token=${verifyToken}`;
    const subject = 'Verify Your Email - DivyaKarya';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #D97706;">Welcome to DivyaKarya!</h2>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${verifyUrl}" style="display: inline-block; background-color: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
        </div>
    `;
    return sendEmail({ to: email, subject, html });
};

module.exports = {
    sendEmail,
    sendPasswordResetEmail,
    sendVerificationEmail
};
