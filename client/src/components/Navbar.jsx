import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, User, Globe } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { language, changeLanguage } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{
            background: 'var(--secondary)',
            color: 'white',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🕉️ DivyaKarya
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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

                <Link to="/about" className="nav-link" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
                <Link to="/contact" className="nav-link" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={18} /> {user.name}
                        </span>
                        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" className="btn btn-outline">Login</Link>
                        <Link to="/register" className="btn btn-primary">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
