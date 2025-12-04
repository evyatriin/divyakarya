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
