import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{ background: 'var(--secondary)', color: 'white', padding: '3rem 1rem', marginTop: 'auto' }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>

                {/* Brand */}
                <div>
                    <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>DivyaKarya</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        Connecting you with experienced Pandits for all your spiritual and religious ceremonies.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Quick Links</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}><Link to="/about" style={{ color: '#ccc', textDecoration: 'none' }}>About Us</Link></li>
                        <li style={{ marginBottom: '0.5rem' }}><Link to="/contact" style={{ color: '#ccc', textDecoration: 'none' }}>Contact Us</Link></li>
                        <li style={{ marginBottom: '0.5rem' }}><Link to="/register-pandit" style={{ color: '#ccc', textDecoration: 'none' }}>Register as Pandit</Link></li>
                        <li style={{ marginBottom: '0.5rem' }}><Link to="/blog" style={{ color: '#ccc', textDecoration: 'none' }}>Blog</Link></li>
                        <li style={{ marginBottom: '0.5rem' }}><Link to="/feedback" style={{ color: '#ccc', textDecoration: 'none' }}>Feedback</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Contact Us</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#ccc' }}>
                        <Mail size={18} /> support@panditoncall.com
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#ccc' }}>
                        <Phone size={18} /> +91 98765 43210
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ccc' }}>
                        <MapPin size={18} /> Hyderabad, India
                    </div>
                </div>

                {/* Social */}
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Follow Us</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href="#" style={{ color: 'white' }}><Facebook /></a>
                        <a href="#" style={{ color: 'white' }}><Twitter /></a>
                        <a href="#" style={{ color: 'white' }}><Instagram /></a>
                    </div>
                </div>

            </div>
            <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid #444', color: '#888' }}>
                &copy; {new Date().getFullYear()} DivyaKarya. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
