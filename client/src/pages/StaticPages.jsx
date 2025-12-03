import React from 'react';

const PlaceholderPage = ({ title }) => (
    <div className="container animate-fade-in" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>{title}</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>
            This page is under construction. Coming soon!
        </p>
    </div>
);

export const About = () => <PlaceholderPage title="About Us" />;
export const Contact = () => <PlaceholderPage title="Contact Us" />;
export const RegisterPandit = () => <PlaceholderPage title="Register as a Pandit" />;
export const Feedback = () => <PlaceholderPage title="Feedback" />;
export const Blog = () => <PlaceholderPage title="Our Blog" />;
