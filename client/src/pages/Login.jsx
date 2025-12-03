import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(formData.email, formData.password, formData.role);
        if (res.success) {
            if (formData.role === 'admin') navigate('/admin');
            else if (formData.role === 'pandit') navigate('/pandit');
            else navigate('/dashboard');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '400px', marginTop: '4rem' }}>
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary)' }}>Welcome Back</h2>
                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">I am a</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['user', 'pandit', 'admin'].map(r => (
                                <label key={r} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value={r}
                                        checked={formData.role === r}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    />
                                    <span style={{ textTransform: 'capitalize' }}>{r}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <label className="label">Email</label>
                    <input
                        type="email"
                        className="input"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <label className="label">Password</label>
                    <input
                        type="password"
                        className="input"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
