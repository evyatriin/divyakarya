import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DynamicPage = ({ slug }) => {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchPage = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${apiUrl}/api/pages/${slug}`);
                setPage(res.data);
            } catch (err) {
                console.error('Error fetching page:', err);
                setError('Failed to load page content.');
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [slug, apiUrl]);

    if (loading) return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading...</div>;
    if (error) return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', color: 'red' }}>{error}</div>;
    if (!page) return <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>Page not found</div>;

    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
            <h1 style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center' }}>{page.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.content }} style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--text)' }} />
        </div>
    );
};

export const About = () => <DynamicPage slug="about-us" />;
export const Contact = () => <DynamicPage slug="contact-us" />;
export const RegisterPandit = () => <DynamicPage slug="register-pandit" />;
export const Feedback = () => <DynamicPage slug="feedback" />;
export const Blog = () => <DynamicPage slug="blog" />;

export const Terms = () => (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center' }}>Terms of Service</h1>
        <div style={{ lineHeight: '1.6', color: 'var(--text)' }}>
            <p><strong>Last Updated: December 2025</strong></p>
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing and using DivyaKarya ("the Platform"), you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

            <h3>2. Services Description</h3>
            <p>DivyaKarya connects users with independent Pandits for religious ceremonies. We act as an intermediary and facilitate bookings, but we do not directly employ the Pandits.</p>

            <h3>3. User Responsibilities</h3>
            <p>You agree to provide accurate information during booking and to treat Pandits with respect. Any abusive behavior may result in account termination.</p>

            <h3>4. Payments and Refunds</h3>
            <p>Bookings require an advance payment. Refunds are processed according to our cancellation policy (full refund if cancelled 24h before).</p>

            <h3>5. Limitation of Liability</h3>
            <p>DivyaKarya is not liable for the quality of services provided by independent Pandits, although we strive to maintain high standards through our verification process.</p>
        </div>
    </div>
);

export const Privacy = () => (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '2rem', textAlign: 'center' }}>Privacy Policy</h1>
        <div style={{ lineHeight: '1.6', color: 'var(--text)' }}>
            <p><strong>Last Updated: December 2025</strong></p>
            <h3>1. Information We Collect</h3>
            <p>We collect information you provide directly to us, such as your name, email, phone number, and address when you register or make a booking.</p>

            <h3>2. How We Use Your Information</h3>
            <p>We use your information to facilitate bookings, process payments, verify accounts, and communicate with you about your scheduled ceremonies.</p>

            <h3>3. Data Sharing</h3>
            <p>We share your booking details (name, address, phone) with the assigned Pandit to facilitate the service. We do not sell your data to third parties.</p>

            <h3>4. Security</h3>
            <p>We implement appropriate technical measures to protect your personal information against unauthorized access or disclosure.</p>

            <h3>5. Contact Us</h3>
            <p>If you have questions about this policy, please contact us at support@divyakarya.com.</p>
        </div>
    </div>
);
