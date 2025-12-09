import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
    // TODO: Replace with actual support number
    const phoneNumber = '919876543210';
    const message = 'Hello! I need assistance with Pandit calling.';

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
