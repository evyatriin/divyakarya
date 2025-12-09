import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { language, changeLanguage } = useLanguage();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showAuthDropdown, setShowAuthDropdown] = useState(false);

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
                    <Link to="/doshas" className="nav-link" onClick={closeMenu}>Doshas</Link>
                    <Link to="/epujas" className="nav-link" onClick={closeMenu}>e-Pujas</Link>
                    <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
                    <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>

                    {user ? (
                        <>
                            <Link
                                to={user.role === 'admin' ? '/admin' : user.role === 'pandit' ? '/pandit' : '/dashboard'}
                                className="btn btn-primary"
                                onClick={closeMenu}
                                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}
                            >
                                Dashboard
                            </Link>
                            <div className="profile-icon" title={user.name || 'Profile'}>
                                <User size={20} />
                            </div>
                            <button
                                onClick={handleLogout}
                                className="logout-btn"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <div className="auth-dropdown-container">
                            <button
                                className="btn btn-primary auth-dropdown-btn"
                                onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                            >
                                Login / Register
                            </button>
                            {showAuthDropdown && (
                                <div className="auth-dropdown">
                                    <Link to="/login" onClick={() => { closeMenu(); setShowAuthDropdown(false); }}>Login</Link>
                                    <Link to="/register" onClick={() => { closeMenu(); setShowAuthDropdown(false); }}>Register</Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Language Selector - Far Right with extra margin */}
                    <select
                        value={language}
                        onChange={(e) => changeLanguage(e.target.value)}
                        className="lang-select"
                        style={{ marginLeft: '1rem' }}
                    >
                        <option value="en">EN</option>
                        <option value="te">తె</option>
                        <option value="ta">த</option>
                        <option value="hi">हि</option>
                    </select>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
