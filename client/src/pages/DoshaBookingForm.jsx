import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const DoshaBookingForm = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user, token } = useAuth();

    const [dosha, setDosha] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const selectedTier = searchParams.get('tier') || 'basic';

    const [form, setForm] = useState({
        // Person Details
        fullName: user?.name || '',
        gotra: '',
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        timeOfBirth: '',
        placeOfBirth: '',

        // Location
        currentCity: '',
        country: 'India',

        // Concern
        primaryConcern: '',
        primaryConcernDetails: '',

        // Family
        familyMembersCount: 1,
        familyMembers: [],

        // Preferences
        preferredLanguage: 'Hindi',
        mode: 'e-puja-video',
        preferredDateStart: '',
        preferredDateEnd: '',
        preferredTimeSlot: 'Morning',
        earliestAuspicious: false,

        // Contact
        mobile: user?.phone || '',
        whatsapp: '',
        email: user?.email || '',

        // Shipping
        shippingAddress: '',
        shippingPincode: '',

        // Extras
        kundliUpload: '',
        doshaConfirmed: false,
        wantsPanditCall: false,
        consent: false,
        customerNotes: ''
    });

    useEffect(() => {
        const fetchDosha = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await axios.get(`${apiUrl}/api/doshas/${slug}`);
                setDosha(res.data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDosha();
    }, [slug]);

    const updateForm = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const addFamilyMember = () => {
        setForm(prev => ({
            ...prev,
            familyMembers: [...prev.familyMembers, { name: '', relation: '' }]
        }));
    };

    const updateFamilyMember = (index, field, value) => {
        setForm(prev => {
            const updated = [...prev.familyMembers];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, familyMembers: updated };
        });
    };

    const removeFamilyMember = (index) => {
        setForm(prev => ({
            ...prev,
            familyMembers: prev.familyMembers.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.consent) {
            setError('Please provide consent to proceed');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${apiUrl}/api/dosha-bookings`, {
                ...form,
                DoshaId: dosha.id,
                pricingTier: selectedTier,
                familyMembersCount: form.familyMembers.length + 1
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit booking');
        } finally {
            setSubmitting(false);
        }
    };

    const formatPrice = (price) => `₹${price?.toLocaleString('en-IN')}`;

    const tierData = dosha?.pricingTiers?.[selectedTier] || { price: dosha?.price, label: 'Basic' };

    if (loading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
    if (!user) {
        return (
            <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>
                <h2>Please Login to Book</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>You need to be logged in to book a Dosha puja.</p>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
            </div>
        );
    }

    if (success) {
        return (
            <div className="container" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h2 style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Booking Submitted!</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                    Your {dosha.name} booking has been received. We will contact you soon to confirm the date and payment details.
                </p>
                <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            </div>
        );
    }

    const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '1rem', marginBottom: '0' };
    const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text)' };

    return (
        <div style={{ background: 'var(--background)', minHeight: '100vh', padding: '2rem 1rem' }}>
            <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Book {dosha.name}</h1>
                    <p style={{ color: 'var(--text-light)' }}>{tierData.label} Package - {formatPrice(tierData.price)}</p>
                </div>

                {/* Progress Steps */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    {[1, 2, 3, 4].map(s => (
                        <div
                            key={s}
                            onClick={() => s < step && setStep(s)}
                            style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: step >= s ? 'var(--primary)' : '#E5E7EB',
                                color: step >= s ? 'white' : 'var(--text-light)',
                                fontWeight: 'bold', cursor: s < step ? 'pointer' : 'default'
                            }}
                        >{s}</div>
                    ))}
                </div>

                {error && (
                    <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Personal Details */}
                    {step === 1 && (
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem' }}>Personal Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Full Name *</label>
                                    <input style={inputStyle} value={form.fullName} onChange={e => updateForm('fullName', e.target.value)} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>Gotra (Family Lineage)</label>
                                    <input style={inputStyle} value={form.gotra} onChange={e => updateForm('gotra', e.target.value)} placeholder="Optional" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Father's Name</label>
                                    <input style={inputStyle} value={form.fatherName} onChange={e => updateForm('fatherName', e.target.value)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Mother's Name</label>
                                    <input style={inputStyle} value={form.motherName} onChange={e => updateForm('motherName', e.target.value)} />
                                </div>
                            </div>

                            <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Birth Details (for Sankalp)</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Date of Birth</label>
                                    <input type="date" style={inputStyle} value={form.dateOfBirth} onChange={e => updateForm('dateOfBirth', e.target.value)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Time of Birth</label>
                                    <input type="time" style={inputStyle} value={form.timeOfBirth} onChange={e => updateForm('timeOfBirth', e.target.value)} />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={labelStyle}>Place of Birth</label>
                                    <input style={inputStyle} value={form.placeOfBirth} onChange={e => updateForm('placeOfBirth', e.target.value)} placeholder="City, State, Country" />
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>Next →</button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Concern & Family */}
                    {step === 2 && (
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem' }}>Your Concern</h3>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>Primary Concern *</label>
                                <select style={inputStyle} value={form.primaryConcern} onChange={e => updateForm('primaryConcern', e.target.value)} required>
                                    <option value="">Select...</option>
                                    <option value="marriage">Marriage Delays</option>
                                    <option value="health">Health Issues</option>
                                    <option value="career">Career/Job Problems</option>
                                    <option value="finances">Financial Difficulties</option>
                                    <option value="children">Children Related</option>
                                    <option value="foreign_travel">Foreign Travel</option>
                                    <option value="relationships">Relationship Issues</option>
                                    <option value="legal">Legal Matters</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>Describe Your Concern (Optional)</label>
                                <textarea style={{ ...inputStyle, minHeight: '80px' }} value={form.primaryConcernDetails} onChange={e => updateForm('primaryConcernDetails', e.target.value)} />
                            </div>

                            <h4 style={{ marginBottom: '1rem' }}>Family Members for Sankalp</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1rem' }}>Add family members to be included in the sankalp (blessing).</p>

                            {form.familyMembers.map((member, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input style={{ ...inputStyle, flex: 2 }} placeholder="Name" value={member.name} onChange={e => updateFamilyMember(i, 'name', e.target.value)} />
                                    <input style={{ ...inputStyle, flex: 1 }} placeholder="Relation" value={member.relation} onChange={e => updateFamilyMember(i, 'relation', e.target.value)} />
                                    <button type="button" onClick={() => removeFamilyMember(i)} style={{ padding: '0.5rem 1rem', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
                                </div>
                            ))}
                            <button type="button" onClick={addFamilyMember} className="btn btn-outline" style={{ marginTop: '0.5rem' }}>+ Add Family Member</button>

                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                                <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Next →</button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Preferences & Contact */}
                    {step === 3 && (
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem' }}>Preferences & Contact</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Preferred Language with Pandit</label>
                                    <select style={inputStyle} value={form.preferredLanguage} onChange={e => updateForm('preferredLanguage', e.target.value)}>
                                        <option value="Hindi">Hindi</option>
                                        <option value="English">English</option>
                                        <option value="Telugu">Telugu</option>
                                        <option value="Tamil">Tamil</option>
                                        <option value="Kannada">Kannada</option>
                                        <option value="Sanskrit">Sanskrit</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Mode of Puja</label>
                                    <select style={inputStyle} value={form.mode} onChange={e => updateForm('mode', e.target.value)}>
                                        <option value="e-puja-video">E-Puja Video Only</option>
                                        <option value="live-zoom">Live Zoom + Recording</option>
                                        <option value="home-visit">Home Visit (if available)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Preferred Date From</label>
                                    <input type="date" style={inputStyle} value={form.preferredDateStart} onChange={e => updateForm('preferredDateStart', e.target.value)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Preferred Date To</label>
                                    <input type="date" style={inputStyle} value={form.preferredDateEnd} onChange={e => updateForm('preferredDateEnd', e.target.value)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Preferred Time</label>
                                    <select style={inputStyle} value={form.preferredTimeSlot} onChange={e => updateForm('preferredTimeSlot', e.target.value)}>
                                        <option value="Morning">Morning (6-10 AM)</option>
                                        <option value="Forenoon">Forenoon (10 AM-12 PM)</option>
                                        <option value="Afternoon">Afternoon (12-4 PM)</option>
                                        <option value="Evening">Evening (4-7 PM)</option>
                                    </select>
                                </div>
                            </div>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.earliestAuspicious} onChange={e => updateForm('earliestAuspicious', e.target.checked)} />
                                <span>Let pandit choose earliest auspicious date/time</span>
                            </label>

                            <h4 style={{ marginBottom: '1rem' }}>Contact Details</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Mobile *</label>
                                    <input style={inputStyle} value={form.mobile} onChange={e => updateForm('mobile', e.target.value)} required />
                                </div>
                                <div>
                                    <label style={labelStyle}>WhatsApp (if different)</label>
                                    <input style={inputStyle} value={form.whatsapp} onChange={e => updateForm('whatsapp', e.target.value)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Email *</label>
                                    <input type="email" style={inputStyle} value={form.email} onChange={e => updateForm('email', e.target.value)} required />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                                <div>
                                    <label style={labelStyle}>Current City</label>
                                    <input style={inputStyle} value={form.currentCity} onChange={e => updateForm('currentCity', e.target.value)} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Country</label>
                                    <input style={inputStyle} value={form.country} onChange={e => updateForm('country', e.target.value)} />
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                                <button type="button" className="btn btn-primary" onClick={() => setStep(4)}>Next →</button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Additional & Confirm */}
                    {step === 4 && (
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem' }}>Additional Information & Confirm</h3>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>Shipping Address (for Prasad)</label>
                                <textarea style={{ ...inputStyle, minHeight: '60px' }} value={form.shippingAddress} onChange={e => updateForm('shippingAddress', e.target.value)} placeholder="Full address with landmark" />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>Pincode</label>
                                <input style={{ ...inputStyle, maxWidth: '150px' }} value={form.shippingPincode} onChange={e => updateForm('shippingPincode', e.target.value)} />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={labelStyle}>Any Notes for the Pandit</label>
                                <textarea style={{ ...inputStyle, minHeight: '60px' }} value={form.customerNotes} onChange={e => updateForm('customerNotes', e.target.value)} placeholder="Special requests, questions, etc." />
                            </div>

                            <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={form.doshaConfirmed} onChange={e => updateForm('doshaConfirmed', e.target.checked)} />
                                    <span>Dosha already confirmed by my astrologer</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={form.wantsPanditCall} onChange={e => updateForm('wantsPanditCall', e.target.checked)} />
                                    <span>I want a 10-min call with pandit before puja (₹199 extra)</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={form.consent} onChange={e => updateForm('consent', e.target.checked)} style={{ marginTop: '0.25rem' }} />
                                    <span style={{ fontSize: '0.9rem' }}>I consent to store my data and share my name/gotra with the temple for sankalp. I understand the refund policy. *</span>
                                </label>
                            </div>

                            {/* Summary */}
                            <div style={{ background: '#FEF3C7', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                <h4 style={{ marginBottom: '0.75rem' }}>Booking Summary</h4>
                                <p style={{ margin: '0.25rem 0' }}><strong>Puja:</strong> {dosha.name}</p>
                                <p style={{ margin: '0.25rem 0' }}><strong>Package:</strong> {tierData.label}</p>
                                <p style={{ margin: '0.25rem 0' }}><strong>Amount:</strong> {formatPrice(tierData.price)}</p>
                                {form.wantsPanditCall && <p style={{ margin: '0.25rem 0' }}><strong>Pandit Call:</strong> ₹199</p>}
                                <p style={{ margin: '0.75rem 0 0', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    Total: {formatPrice(tierData.price + (form.wantsPanditCall ? 199 : 0))}
                                </p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setStep(3)}>← Back</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting || !form.consent}>
                                    {submitting ? 'Submitting...' : 'Submit Booking'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default DoshaBookingForm;
