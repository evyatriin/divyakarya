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

const sendBookingConfirmation = async (bookingData) => {
    const subject = 'Booking Confirmation - DivyaKarya';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #D97706;">Booking Received! 🕉️</h2>
            <p>Dear ${bookingData.customerName || 'User'},</p>
            <p>We have successfully received your booking request. Here are the details:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #F59E0B; margin-top: 0;">${bookingData.ceremonyType}</h3>
                <p><strong>Date:</strong> ${bookingData.date}</p>
                <p><strong>Time:</strong> ${bookingData.time}</p>
                <p><strong>Location:</strong> ${bookingData.address}</p>
                <p><strong>Amount:</strong> ₹${bookingData.totalAmount}</p>
            </div>

            ${bookingData.paymentRequired ? `
            <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeeba;">
                <strong>Action Required:</strong> Please complete the advance payment of ₹${bookingData.paymentRequired} to confirm your slot.
            </div>` : ''}

            <p>We will contact you at <strong>${bookingData.customerPhone}</strong> or <strong>${bookingData.customerEmail}</strong> shortly.</p>
            
            <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
                Best regards,<br>
                DivyaKarya Team
            </p>
        </div>
    `;
    return sendEmail({ to: bookingData.customerEmail, subject, html });
};

module.exports = {
    sendEmail,
    sendPasswordResetEmail,
    sendVerificationEmail,
    sendBookingConfirmation
};
