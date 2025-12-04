// Mock Email Service - logs emails instead of sending them

const sendBookingConfirmation = async (bookingData) => {
    // Mock email content
    const emailContent = {
        to: bookingData.customerEmail,
        from: 'noreply@divyakarya.com',
        subject: 'Booking Confirmation - DivyaKarya',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #D97706;">Thank You for Your Booking!</h2>
                <p>Dear ${bookingData.customerName},</p>
                <p>We have received your booking request. Our team will get back to you as soon as possible.</p>
                
                <h3 style="color: #F59E0B;">Booking Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Ceremony:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingData.ceremonyType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingData.date}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingData.time}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Location:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingData.city} - ${bookingData.locationType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Tradition:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingData.tradition}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Purpose:</strong></td>
                        <td style="padding: 8px; border-bottom: 1px solid #eee;">${bookingData.purpose}</td>
                    </tr>
                </table>
                
                <p style="margin-top: 20px;">We will contact you at <strong>${bookingData.customerPhone}</strong> or <strong>${bookingData.customerEmail}</strong> shortly.</p>
                
                <p style="color: #666; font-size: 0.9em; margin-top: 30px;">
                    Best regards,<br>
                    DivyaKarya Team
                </p>
            </div>
        `
    };

    // Log the email instead of sending
    console.log('📧 [MOCK EMAIL] Would send email:');
    console.log('To:', emailContent.to);
    console.log('Subject:', emailContent.subject);
    console.log('Content:', emailContent.html);

    // Simulate async email sending
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Email logged successfully (mock)',
                emailPreview: emailContent
            });
        }, 500);
    });
};

module.exports = {
    sendBookingConfirmation
};
