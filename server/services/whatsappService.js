const twilio = require('twilio');

// Initialize Twilio client
// NOTE: These environment variables need to be set in .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'

let client;

if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
} else {
    console.warn('Twilio credentials not found. WhatsApp service will be mocked.');
}

const whatsappService = {
    /**
     * Send a WhatsApp message to a specific number
     * @param {string} to - The recipient's phone number (in E.164 format, e.g., +919876543210)
     * @param {string} body - The message content
     */
    sendMessage: async (to, body) => {
        try {
            if (!client) {
                console.log(`[MOCK WHATSAPP] To: ${to}, Body: ${body}`);
                return { success: true, mocked: true };
            }

            // Ensure the 'to' number has the 'whatsapp:' prefix if not present
            const toAddress = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

            const message = await client.messages.create({
                body: body,
                from: fromNumber,
                to: toAddress
            });

            console.log(`WhatsApp sent: ${message.sid}`);
            return { success: true, sid: message.sid };
        } catch (error) {
            console.error('Error sending WhatsApp message:', error);
            // Don't throw error to prevent blocking main flow, but return failure status
            return { success: false, error: error.message };
        }
    },

    /**
     * Send a booking confirmation message
     * @param {object} booking - The booking object
     * @param {object} user - The user object
     */
    sendBookingConfirmation: async (booking, user) => {
        if (!user.phoneNumber) {
            console.warn('Cannot send WhatsApp: User has no phone number.');
            return;
        }

        const message = `Namaste ${user.name},
Maproved! Your booking for *${booking.ceremonyType || 'Ceremony'}* has been confirmed.
    
📅 Date: ${new Date(booking.bookingDate).toLocaleDateString()}
🕒 Time: ${booking.bookingTime}
📍 Location: ${booking.location}
    
Our Panditji will contact you shortly.
    
Reference ID: #${booking.id}
    
Thank you for choosing PanditOnCall!`;

        return whatsappService.sendMessage(user.phoneNumber, message);
    }
};

module.exports = whatsappService;
