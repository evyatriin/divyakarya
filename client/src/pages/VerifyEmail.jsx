import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        const verifyToken = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/auth/verify-email?token=${token}`);
                setStatus('success');
                setMessage(res.data.message);

                // Optional: Auto redirect
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.error || 'Verification failed. Token might be expired.');
            }
        };

        verifyToken();
    }, [token, navigate]);

    return (
        <div className="container animate-fade-in" style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    {status === 'verifying' && (
                        <div style={{
                            width: '50px', height: '50px', border: '5px solid #E5E7EB',
                            borderTop: '5px solid var(--primary)', borderRadius: '50%',
                            margin: '0 auto', animation: 'spin 1s linear infinite'
                        }}></div>
                    )}
                    {status === 'success' && <CheckCircle size={64} color="#10B981" style={{ margin: '0 auto' }} />}
                    {status === 'error' && <XCircle size={64} color="#EF4444" style={{ margin: '0 auto' }} />}
                </div>

                <h2 style={{ marginBottom: '1rem', color: status === 'error' ? '#EF4444' : status === 'success' ? '#047857' : 'var(--text-dark)' }}>
                    {status === 'verifying' ? 'Verifying Email' : status === 'success' ? 'Email Verified!' : 'Verification Failed'}
                </h2>

                <p style={{ color: 'var(--text-light)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                    {message}
                </p>

                {status === 'success' && (
                    <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ width: '100%' }}>
                        Go to Login
                    </button>
                )}

                {status === 'error' && (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link to="/" className="btn btn-outline">Go Home</Link>
                        <Link to="/register" className="btn btn-primary">Register Again</Link>
                    </div>
                )}

                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default VerifyEmail;
