import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, User, Globe, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { language, changeLanguage } = useLanguage();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="nav-brand" onClick={closeMenu}>
                    🕉️ DivyaKarya
                </Link>

                <button className="mobile-toggle" onClick={toggleMenu}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    {/* Language Selector */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe size={18} />
                        <select
                            value={language}
                            onChange={(e) => changeLanguage(e.target.value)}
                            style={{
                                background: 'transparent',
                                color: 'white',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                padding: '0.25rem',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="en">English</option>
                            <option value="te">Telugu</option>
                            <option value="ta">Tamil</option>
                        </select>
                    </div>

                    <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
                    <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>

                    {user ? (
                        <>
                            <Link
                                to={user.role === 'admin' ? '/admin' : user.role === 'pandit' ? '/pandit' : '/dashboard'}
                                className="btn btn-primary"
                                onClick={closeMenu}
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}
                            >
                                Dashboard
                            </Link>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <User size={18} /> {user.name}
                            </span>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem', flexDirection: isMenuOpen ? 'column' : 'row', width: isMenuOpen ? '100%' : 'auto' }}>
                            <Link to="/login" className="btn btn-outline" onClick={closeMenu}>Login</Link>
                            <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
