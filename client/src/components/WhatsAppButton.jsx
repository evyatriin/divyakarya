import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import axios from 'axios';

const WhatsAppButton = () => {
    const [phoneNumber, setPhoneNumber] = useState('919876543210');
    const message = 'Hello! I need assistance with Pandit booking.';

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/settings`);
                if (res.data.whatsappNumber) {
                    // Remove any non-digit characters
                    setPhoneNumber(res.data.whatsappNumber.replace(/\D/g, ''));
                }
            } catch (error) {
                console.log('Using default WhatsApp number');
            }
        };
        fetchSettings();
    }, []);

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div
            onClick={handleClick}
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                backgroundColor: '#25D366',
                color: 'white',
                borderRadius: '50%',
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                zIndex: 1000,
                transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="Chat with us on WhatsApp"
        >
            <MessageCircle size={32} />
        </div>
    );
};

export default WhatsAppButton;
