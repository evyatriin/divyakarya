import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [role, setRole] = useState('user');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', specialization: '', experience: 0
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await register(formData, role);
        if (res.success) {
            navigate('/login');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '500px', marginTop: '4rem' }}>
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--primary)' }}>Create Account</h2>
                {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                    <button
                        type="button"
                        className={`btn ${role === 'user' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setRole('user')}
                    >
                        User
                    </button>
                    <button
                        type="button"
                        className={`btn ${role === 'pandit' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setRole('pandit')}
                    >
                        Pandit
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label className="label">Full Name</label>
                    <input type="text" className="input" required onChange={e => setFormData({ ...formData, name: e.target.value })} />

                    <label className="label">Email</label>
                    <input type="email" className="input" required onChange={e => setFormData({ ...formData, email: e.target.value })} />

                    <label className="label">Phone</label>
                    <input type="tel" className="input" required onChange={e => setFormData({ ...formData, phone: e.target.value })} />

                    <label className="label">Password</label>
                    <input type="password" className="input" required onChange={e => setFormData({ ...formData, password: e.target.value })} />

                    {role === 'pandit' && (
                        <>
                            <label className="label">Specialization (e.g. Puja, Wedding)</label>
                            <input type="text" className="input" required onChange={e => setFormData({ ...formData, specialization: e.target.value })} />

                            <label className="label">Years of Experience</label>
                            <input type="number" className="input" required onChange={e => setFormData({ ...formData, experience: e.target.value })} />
                        </>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
