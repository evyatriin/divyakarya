import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, DollarSign, TrendingUp, UserCheck, XCircle, Plus, Edit, Trash2, Settings, CheckCircle, Eye } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [pandits, setPandits] = useState([]);
    const [ceremonies, setCeremonies] = useState([]);
    const [availablePandits, setAvailablePandits] = useState({ availablePandits: [], unscheduledPandits: [] });
    const [stats, setStats] = useState({
        totalBookings: 0, pendingBookings: 0, completedBookings: 0, cancelledBookings: 0,
        totalRevenue: 0, advanceCollected: 0, activePandits: 0, totalUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Ceremony form
    const [showCeremonyModal, setShowCeremonyModal] = useState(false);
    const [editingCeremony, setEditingCeremony] = useState(null);
    const [ceremonyForm, setCeremonyForm] = useState({
        title: '', slug: '', description: '', icon: '🕉️', image: '', basePrice: 2500, samagri: '', process: ''
    });

    // Pandit form
    const [showPanditModal, setShowPanditModal] = useState(false);
    const [editingPandit, setEditingPandit] = useState(null);
    const [panditForm, setPanditForm] = useState({
        name: '', email: '', password: '', phone: '', specialization: '', experience: 0
    });
    const [viewingPandit, setViewingPandit] = useState(null);

    // Inline notification states
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [confirmDeleteCeremony, setConfirmDeleteCeremony] = useState(null);
    const [confirmDeletePandit, setConfirmDeletePandit] = useState(null);

    // Doshas and ePujas for Catalog management
    const [doshas, setDoshas] = useState([]);
    const [epujas, setEpujas] = useState([]);
    // Removed editingPrice state as we are moving to full edit modals

    // Dosha Form
    const [showDoshaModal, setShowDoshaModal] = useState(false);
    const [editingDosha, setEditingDosha] = useState(null);
    const [doshaForm, setDoshaForm] = useState({
        name: '', slug: '', description: '', icon: '🔴', image: '', price: 2100,
        duration: '2-3 hours', remedies: '', details: '', participantLimit: ''
    });

    // EPuja Form
    const [showEPujaModal, setShowEPujaModal] = useState(false);
    const [editingEPuja, setEditingEPuja] = useState(null);
    const [epujaForm, setEpujaForm] = useState({
        name: '', slug: '', description: '', icon: '🛕', image: '', price: 1100,
        priceType: 'fixed', tag: '', details: '', features: '', participantLimit: ''
    });

    // Delete confirm states
    const [confirmDeleteDosha, setConfirmDeleteDosha] = useState(null);
    const [confirmDeleteEPuja, setConfirmDeleteEPuja] = useState(null);

    // Site Settings
    const [siteSettings, setSiteSettings] = useState({
        whatsappNumber: '',
        pujaLocations: []
    });
    const [newLocation, setNewLocation] = useState('');
    const [savingSettings, setSavingSettings] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [bookingsRes, panditsRes, statsRes, ceremoniesRes, doshasRes, epujasRes] = await Promise.all([
                axios.get(`${apiUrl}/api/bookings`),
                axios.get(`${apiUrl}/api/pandits`),
                axios.get(`${apiUrl}/api/admin/stats`),
                axios.get(`${apiUrl}/api/ceremonies`),
                axios.get(`${apiUrl}/api/doshas/admin/all`),
                axios.get(`${apiUrl}/api/epujas/admin/all`)
            ]);
            setBookings(bookingsRes.data);
            setPandits(panditsRes.data);
            setStats(statsRes.data);
            setCeremonies(ceremoniesRes.data);
            setDoshas(doshasRes.data || []);
            setEpujas(epujasRes.data || []);
            setLoading(false);

            // Fetch settings
            try {
                const settingsRes = await axios.get(`${apiUrl}/api/settings`);
                setSiteSettings({
                    whatsappNumber: settingsRes.data.whatsappNumber || '',
                    pujaLocations: settingsRes.data.pujaLocations || []
                });
            } catch (e) {
                console.log('Settings not found, using defaults');
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    const fetchAvailablePandits = async (booking) => {
        try {
            const res = await axios.get(`${apiUrl}/api/admin/available-pandits`, {
                params: { date: booking.date, time: booking.time }
            });
            setAvailablePandits(res.data);
            setSelectedBooking(booking);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const assignPandit = async (bookingId, panditId, slotId = null) => {
        try {
            await axios.put(`${apiUrl}/api/admin/assign`, { bookingId, panditId, slotId });
            setSelectedBooking(null);
            fetchData();
            setSuccessMessage('Pandit assigned successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error assigning pandit');
            setTimeout(() => setError(''), 5000);
        }
    };

    // Ceremony CRUD
    const openCeremonyModal = (ceremony = null) => {
        if (ceremony) {
            setEditingCeremony(ceremony);
            setCeremonyForm({
                title: ceremony.title, slug: ceremony.slug, description: ceremony.description || '',
                icon: ceremony.icon || '🕉️', image: ceremony.image || '', basePrice: ceremony.basePrice || 2500,
                samagri: (ceremony.samagri || []).join(', '), process: (ceremony.process || []).join(', ')
            });
        } else {
            setEditingCeremony(null);
            setCeremonyForm({ title: '', slug: '', description: '', icon: '🕉️', image: '', basePrice: 2500, samagri: '', process: '' });
        }
        setShowCeremonyModal(true);
    };

    const saveCeremony = async () => {
        try {
            const data = {
                ...ceremonyForm,
                samagri: ceremonyForm.samagri.split(',').map(s => s.trim()).filter(s => s),
                process: ceremonyForm.process.split(',').map(s => s.trim()).filter(s => s),
                basePrice: parseFloat(ceremonyForm.basePrice) || 2500
            };
            if (editingCeremony) {
                await axios.put(`${apiUrl}/api/ceremonies/${editingCeremony.id}`, data);
            } else {
                await axios.post(`${apiUrl}/api/ceremonies`, data);
            }
            setShowCeremonyModal(false);
            fetchData();
            setSuccessMessage('Ceremony saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error saving ceremony');
            setTimeout(() => setError(''), 5000);
        }
    };

    const deleteCeremony = async (id) => {
        try {
            await axios.delete(`${apiUrl}/api/ceremonies/${id}`);
            fetchData();
            setConfirmDeleteCeremony(null);
            setSuccessMessage('Ceremony deleted!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setConfirmDeleteCeremony(null);
            setError(err.response?.data?.error || 'Error deleting ceremony');
            setTimeout(() => setError(''), 5000);
        }
    };

    // Pandit CRUD
    const openPanditModal = (pandit = null) => {
        if (pandit) {
            setEditingPandit(pandit);
            setPanditForm({
                name: pandit.name, email: pandit.email, password: '', phone: pandit.phone,
                specialization: pandit.specialization || '', experience: pandit.experience || 0
            });
        } else {
            setEditingPandit(null);
            setPanditForm({ name: '', email: '', password: '', phone: '', specialization: '', experience: 0 });
        }
        setShowPanditModal(true);
    };

    const savePandit = async () => {
        try {
            if (editingPandit) {
                await axios.put(`${apiUrl}/api/pandits/${editingPandit.id}`, panditForm);
            } else {
                if (!panditForm.password) {
                    setError('Password is required for new pandit');
                    setTimeout(() => setError(''), 5000);
                    return;
                }
                await axios.post(`${apiUrl}/api/pandits`, panditForm);
            }
            setShowPanditModal(false);
            fetchData();
            setSuccessMessage('Pandit saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error saving pandit');
            setTimeout(() => setError(''), 5000);
        }
    };

    const togglePanditVerification = async (id) => {
        try {
            await axios.put(`${apiUrl}/api/pandits/${id}/verify`);
            fetchData();
            setSuccessMessage('Pandit verification updated!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error updating verification');
            setTimeout(() => setError(''), 5000);
        }
    };

    const deletePandit = async (id) => {
        try {
            await axios.delete(`${apiUrl}/api/pandits/${id}`);
            fetchData();
            setConfirmDeletePandit(null);
            setSuccessMessage('Pandit deleted!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setConfirmDeletePandit(null);
            setError(err.response?.data?.error || 'Error deleting pandit');
            setTimeout(() => setError(''), 5000);
        }
    };

    const viewPanditDetails = async (id) => {
        try {
            const res = await axios.get(`${apiUrl}/api/pandits/${id}/details`);
            setViewingPandit(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching pandit details');
            setTimeout(() => setError(''), 5000);
        }
    };

    // Dosha CRUD
    const openDoshaModal = (dosha = null) => {
        if (dosha) {
            setEditingDosha(dosha);
            setDoshaForm({
                name: dosha.name, slug: dosha.slug, description: dosha.description || '',
                icon: dosha.icon || '🔴', image: dosha.image || '', price: dosha.price || 2100,
                duration: dosha.duration || '2-3 hours',
                remedies: (dosha.remedies || []).join(', '),
                details: dosha.details || '',
                participantLimit: dosha.participantLimit || ''
            });
        } else {
            setEditingDosha(null);
            setDoshaForm({
                name: '', slug: '', description: '', icon: '🔴', image: '', price: 2100,
                duration: '2-3 hours', remedies: '', details: '', participantLimit: ''
            });
        }
        setShowDoshaModal(true);
    };

    const saveDosha = async () => {
        try {
            const data = {
                ...doshaForm,
                remedies: doshaForm.remedies.split(',').map(s => s.trim()).filter(s => s),
                price: parseFloat(doshaForm.price) || 0,
                participantLimit: doshaForm.participantLimit ? parseInt(doshaForm.participantLimit) : null
            };
            if (editingDosha) {
                await axios.put(`${apiUrl}/api/doshas/${editingDosha.id}`, data);
            } else {
                await axios.post(`${apiUrl}/api/doshas`, data);
            }
            setShowDoshaModal(false);
            fetchData();
            setSuccessMessage('Dosha saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error saving dosha');
            setTimeout(() => setError(''), 5000);
        }
    };

    const deleteDosha = async (id) => {
        try {
            await axios.delete(`${apiUrl}/api/doshas/${id}`);
            fetchData();
            setConfirmDeleteDosha(null);
            setSuccessMessage('Dosha deleted!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setConfirmDeleteDosha(null);
            setError(err.response?.data?.error || 'Error deleting dosha');
            setTimeout(() => setError(''), 5000);
        }
    };

    // EPuja CRUD
    const openEPujaModal = (epuja = null) => {
        if (epuja) {
            setEditingEPuja(epuja);
            setEpujaForm({
                name: epuja.name, slug: epuja.slug, description: epuja.description || '',
                icon: epuja.icon || '🛕', image: epuja.image || '', price: epuja.price || 1100,
                priceType: epuja.priceType || 'fixed', tag: epuja.tag || '',
                details: epuja.details || '',
                features: (epuja.features || []).join(', '),
                participantLimit: epuja.participantLimit || ''
            });
        } else {
            setEditingEPuja(null);
            setEpujaForm({
                name: '', slug: '', description: '', icon: '🛕', image: '', price: 1100,
                priceType: 'fixed', tag: '', details: '', features: '', participantLimit: ''
            });
        }
        setShowEPujaModal(true);
    };

    const saveEPuja = async () => {
        try {
            const data = {
                ...epujaForm,
                features: epujaForm.features.split(',').map(s => s.trim()).filter(s => s),
                price: parseFloat(epujaForm.price) || 0,
                participantLimit: epujaForm.participantLimit ? parseInt(epujaForm.participantLimit) : null
            };
            if (editingEPuja) {
                await axios.put(`${apiUrl}/api/epujas/${editingEPuja.id}`, data);
            } else {
                await axios.post(`${apiUrl}/api/epujas`, data);
            }
            setShowEPujaModal(false);
            fetchData();
            setSuccessMessage('e-Puja saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Error saving e-Puja');
            setTimeout(() => setError(''), 5000);
        }
    };

    const deleteEPuja = async (id) => {
        try {
            await axios.delete(`${apiUrl}/api/epujas/${id}`);
            fetchData();
            setConfirmDeleteEPuja(null);
            setSuccessMessage('e-Puja deleted!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setConfirmDeleteEPuja(null);
            setError(err.response?.data?.error || 'Error deleting e-Puja');
            setTimeout(() => setError(''), 5000);
        }
    };

    const filteredBookings = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: '#FEF3C7', color: '#92400E' },
            accepted: { bg: '#D1FAE5', color: '#065F46' },
            completed: { bg: '#DBEAFE', color: '#1E40AF' },
            rejected: { bg: '#FEE2E2', color: '#991B1B' },
            cancelled: { bg: '#F3F4F6', color: '#6B7280' }
        };
        const s = styles[status] || styles.pending;
        return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600', background: s.bg, color: s.color }}>{status}</span>;
    };

    if (loading) return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Admin Dashboard</h1>

            {/* Inline Error Banner */}
            {error && (
                <div style={{
                    backgroundColor: '#FEE2E2', border: '1px solid #EF4444', color: '#991B1B',
                    padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <XCircle size={20} />
                    <span>{error}</span>
                    <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>
            )}

            {/* Inline Success Banner */}
            {successMessage && (
                <div style={{
                    backgroundColor: '#D1FAE5', border: '1px solid #10B981', color: '#065F46',
                    padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                    <CheckCircle size={20} />
                    <span>{successMessage}</span>
                    <button onClick={() => setSuccessMessage('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
                </div>
            )}

            {/* Delete Confirmation Modals */}
            {(confirmDeleteCeremony || confirmDeleteDosha || confirmDeleteEPuja || confirmDeletePandit) && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h3>Delete Item?</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                            Are you sure you want to delete this item?
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => {
                                setConfirmDeleteCeremony(null);
                                setConfirmDeleteDosha(null);
                                setConfirmDeleteEPuja(null);
                                setConfirmDeletePandit(null);
                            }} className="btn btn-outline">Cancel</button>
                            <button onClick={() => {
                                if (confirmDeleteCeremony) deleteCeremony(confirmDeleteCeremony);
                                if (confirmDeleteDosha) deleteDosha(confirmDeleteDosha);
                                if (confirmDeleteEPuja) deleteEPuja(confirmDeleteEPuja);
                                if (confirmDeletePandit) deletePandit(confirmDeletePandit);
                            }} className="btn btn-primary" style={{ backgroundColor: '#EF4444' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['bookings', 'pandits', 'ceremonies', 'catalog', 'settings'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={activeTab === tab ? 'btn btn-primary' : 'btn btn-outline'}
                        style={{ textTransform: 'capitalize' }}>
                        {tab === 'ceremonies' ? 'Pujas' : tab === 'pandits' ? 'Pandits' : tab === 'catalog' ? 'Catalog' : tab === 'settings' ? 'Settings' : 'Bookings'}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                    <Calendar size={24} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalBookings}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Bookings</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                    <DollarSign size={24} color="#10B981" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹{stats.totalRevenue?.toLocaleString()}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Revenue</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                    <Users size={24} color="#6366F1" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pandits.length}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Pandits</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                    <Settings size={24} color="#F59E0B" style={{ margin: '0 auto 0.5rem' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{ceremonies.length}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>Pujas</div>
                </div>
            </div>

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Bookings</h3>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                            className="input" style={{ width: 'auto', padding: '0.5rem', marginBottom: 0 }}>
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                                    <th style={{ padding: '0.5rem' }}>ID</th>
                                    <th style={{ padding: '0.5rem' }}>Ceremony</th>
                                    <th style={{ padding: '0.5rem' }}>Date</th>
                                    <th style={{ padding: '0.5rem' }}>Status</th>
                                    <th style={{ padding: '0.5rem' }}>Amount</th>
                                    <th style={{ padding: '0.5rem' }}>Pandit</th>
                                    <th style={{ padding: '0.5rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map(b => (
                                    <tr key={b.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <td style={{ padding: '0.5rem' }}>#{b.id}</td>
                                        <td style={{ padding: '0.5rem' }}>{b.ceremonyType}</td>
                                        <td style={{ padding: '0.5rem' }}>{b.date}</td>
                                        <td style={{ padding: '0.5rem' }}>{getStatusBadge(b.status)}</td>
                                        <td style={{ padding: '0.5rem' }}>₹{b.totalAmount || b.amount}</td>
                                        <td style={{ padding: '0.5rem' }}>{b.Pandit?.name || '-'}</td>
                                        <td style={{ padding: '0.5rem' }}>
                                            {!b.PanditId && b.status !== 'cancelled' && (
                                                <button onClick={() => fetchAvailablePandits(b)} className="btn btn-primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>Assign</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* PANDITS TAB */}
            {activeTab === 'pandits' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Manage Pandits</h3>
                        <button onClick={() => openPanditModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> Add Pandit
                        </button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem' }}>Name</th>
                                    <th style={{ padding: '0.75rem' }}>Contact</th>
                                    <th style={{ padding: '0.75rem' }}>Specialization</th>
                                    <th style={{ padding: '0.75rem' }}>Status</th>
                                    <th style={{ padding: '0.75rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pandits.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div style={{ fontWeight: '500' }}>{p.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{p.experience} yrs exp</div>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div style={{ fontSize: '0.9rem' }}>{p.phone}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{p.email}</div>
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>{p.specialization || '-'}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem',
                                                background: p.isVerified ? '#D1FAE5' : '#FEE2E2',
                                                color: p.isVerified ? '#065F46' : '#991B1B'
                                            }}>
                                                {p.isVerified ? 'Verified' : 'Unverified'}
                                            </span>
                                            {p.isOnline && <span style={{ marginLeft: '0.5rem', color: '#10B981' }}>● Online</span>}
                                        </td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => viewPanditDetails(p.id)} className="btn btn-outline" style={{ padding: '0.3rem 0.5rem' }} title="View Details">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => togglePanditVerification(p.id)} className="btn"
                                                    style={{ padding: '0.3rem 0.5rem', background: p.isVerified ? '#FEE2E2' : '#D1FAE5', color: p.isVerified ? '#991B1B' : '#065F46' }}
                                                    title={p.isVerified ? 'Disable' : 'Enable'}>
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button onClick={() => openPanditModal(p)} className="btn btn-outline" style={{ padding: '0.3rem 0.5rem' }} title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => setConfirmDeletePandit(p.id)} className="btn" style={{ padding: '0.3rem 0.5rem', background: '#FEE2E2', color: '#991B1B' }} title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* CEREMONIES TAB */}
            {activeTab === 'ceremonies' && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3>Manage Pujas</h3>
                        <button onClick={() => openCeremonyModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={18} /> Add Puja
                        </button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem' }}>Icon</th>
                                    <th style={{ padding: '0.75rem' }}>Title</th>
                                    <th style={{ padding: '0.75rem' }}>Slug</th>
                                    <th style={{ padding: '0.75rem' }}>Price</th>
                                    <th style={{ padding: '0.75rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ceremonies.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <td style={{ padding: '0.75rem', fontSize: '1.5rem' }}>{c.icon}</td>
                                        <td style={{ padding: '0.75rem', fontWeight: '500' }}>{c.title}</td>
                                        <td style={{ padding: '0.75rem', color: 'var(--text-light)' }}>{c.slug}</td>
                                        <td style={{ padding: '0.75rem', fontWeight: '600', color: '#10B981' }}>₹{c.basePrice}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <button onClick={() => openCeremonyModal(c)} className="btn btn-outline" style={{ padding: '0.3rem 0.5rem', marginRight: '0.5rem' }}><Edit size={16} /></button>
                                            <button onClick={() => setConfirmDeleteCeremony(c.id)} className="btn" style={{ padding: '0.3rem 0.5rem', background: '#FEE2E2', color: '#991B1B' }}><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* CEREMONY MODAL */}
            {showCeremonyModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ maxWidth: '500px', margin: '1rem', maxHeight: '90vh', overflow: 'auto' }}>
                        <h3 style={{ marginBottom: '1rem' }}>{editingCeremony ? 'Edit Puja' : 'Add Puja'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label className="label">Title *</label><input className="input" value={ceremonyForm.title} onChange={e => setCeremonyForm({ ...ceremonyForm, title: e.target.value })} /></div>
                            <div><label className="label">Slug *</label><input className="input" value={ceremonyForm.slug} onChange={e => setCeremonyForm({ ...ceremonyForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label className="label">Price (₹)</label><input className="input" type="number" value={ceremonyForm.basePrice} onChange={e => setCeremonyForm({ ...ceremonyForm, basePrice: e.target.value })} /></div>
                            <div><label className="label">Icon</label><input className="input" value={ceremonyForm.icon} onChange={e => setCeremonyForm({ ...ceremonyForm, icon: e.target.value })} /></div>
                        </div>
                        <label className="label">Description</label>
                        <textarea className="input" value={ceremonyForm.description} onChange={e => setCeremonyForm({ ...ceremonyForm, description: e.target.value })} rows={2} />
                        <label className="label">Samagri (comma-separated)</label>
                        <input className="input" value={ceremonyForm.samagri} onChange={e => setCeremonyForm({ ...ceremonyForm, samagri: e.target.value })} />
                        <label className="label">Process (comma-separated)</label>
                        <input className="input" value={ceremonyForm.process} onChange={e => setCeremonyForm({ ...ceremonyForm, process: e.target.value })} />
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowCeremonyModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            <button onClick={saveCeremony} className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* PANDIT MODAL */}
            {showPanditModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ maxWidth: '500px', margin: '1rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>{editingPandit ? 'Edit Pandit' : 'Add Pandit'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label className="label">Name *</label><input className="input" value={panditForm.name} onChange={e => setPanditForm({ ...panditForm, name: e.target.value })} /></div>
                            <div><label className="label">Phone *</label><input className="input" value={panditForm.phone} onChange={e => setPanditForm({ ...panditForm, phone: e.target.value })} /></div>
                        </div>
                        <label className="label">Email *</label>
                        <input className="input" type="email" value={panditForm.email} onChange={e => setPanditForm({ ...panditForm, email: e.target.value })} disabled={!!editingPandit} />
                        {!editingPandit && (
                            <><label className="label">Password *</label>
                                <input className="input" type="password" value={panditForm.password} onChange={e => setPanditForm({ ...panditForm, password: e.target.value })} /></>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                            <div><label className="label">Specialization</label><input className="input" value={panditForm.specialization} onChange={e => setPanditForm({ ...panditForm, specialization: e.target.value })} /></div>
                            <div><label className="label">Experience (yrs)</label><input className="input" type="number" value={panditForm.experience} onChange={e => setPanditForm({ ...panditForm, experience: e.target.value })} /></div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowPanditModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            <button onClick={savePandit} className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* PANDIT DETAILS MODAL */}
            {viewingPandit && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ maxWidth: '400px', margin: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3>Pandit Details</h3>
                            <button onClick={() => setViewingPandit(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{viewingPandit.name}</div>
                            <div style={{ color: 'var(--text-light)' }}>{viewingPandit.specialization}</div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10B981' }}>₹{viewingPandit.stats?.totalRevenue?.toLocaleString() || 0}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Total Revenue</div>
                            </div>
                            <div style={{ background: '#F3F4F6', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{viewingPandit.stats?.completedBookings || 0}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Completed</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                            <div>📱 {viewingPandit.phone}</div>
                            <div>📧 {viewingPandit.email}</div>
                            <div>📅 Joined: {new Date(viewingPandit.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Catalog Tab */}
            {activeTab === 'catalog' && (
                <div>
                    {/* Doshas Section */}
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ color: 'var(--secondary)' }}>🕉️ Dosha Remedies</h3>
                            <button onClick={() => openDoshaModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Plus size={18} /> Add Dosha
                            </button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Icon</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Duration</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Limit</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Price (₹)</th>
                                        <th style={{ textAlign: 'center', padding: '0.75rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doshas.map(dosha => (
                                        <tr key={dosha.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ padding: '0.75rem', fontSize: '1.5rem' }}>{dosha.icon}</td>
                                            <td style={{ padding: '0.75rem', fontWeight: '500' }}>{dosha.name}</td>
                                            <td style={{ padding: '0.75rem', color: 'var(--text-light)' }}>{dosha.duration}</td>
                                            <td style={{ padding: '0.75rem', color: 'var(--text-light)' }}>{dosha.participantLimit || 'No Limit'}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{dosha.price?.toLocaleString()}</span>
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                <button onClick={() => openDoshaModal(dosha)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginRight: '0.5rem' }}>
                                                    <Edit size={14} /> Edit
                                                </button>
                                                <button onClick={() => setConfirmDeleteDosha(dosha.id)} className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#FEE2E2', color: '#991B1B' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* e-Pujas Section */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ color: 'var(--secondary)' }}>📱 e-Puja Services</h3>
                            <button onClick={() => openEPujaModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Plus size={18} /> Add e-Puja
                            </button>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Icon</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Name</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Tag</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Limit</th>
                                        <th style={{ textAlign: 'left', padding: '0.75rem' }}>Price (₹)</th>
                                        <th style={{ textAlign: 'center', padding: '0.75rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {epujas.map(epuja => (
                                        <tr key={epuja.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                            <td style={{ padding: '0.75rem', fontSize: '1.5rem' }}>{epuja.icon}</td>
                                            <td style={{ padding: '0.75rem', fontWeight: '500' }}>{epuja.name}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                {epuja.tag && <span style={{ background: '#FEF3C7', color: '#92400E', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>{epuja.tag}</span>}
                                            </td>
                                            <td style={{ padding: '0.75rem', color: 'var(--text-light)' }}>{epuja.participantLimit || 'No Limit'}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{epuja.price?.toLocaleString()}</span>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{epuja.priceType}</div>
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                <button onClick={() => openEPujaModal(epuja)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginRight: '0.5rem' }}>
                                                    <Edit size={14} /> Edit
                                                </button>
                                                <button onClick={() => setConfirmDeleteEPuja(epuja.id)} className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: '#FEE2E2', color: '#991B1B' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* DOSHA MODAL */}
            {showDoshaModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ maxWidth: '500px', margin: '1rem', maxHeight: '90vh', overflow: 'auto' }}>
                        <h3 style={{ marginBottom: '1rem' }}>{editingDosha ? 'Edit Dosha' : 'Add Dosha'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label className="label">Name *</label><input className="input" value={doshaForm.name} onChange={e => setDoshaForm({ ...doshaForm, name: e.target.value })} /></div>
                            <div><label className="label">Slug *</label><input className="input" value={doshaForm.slug} onChange={e => setDoshaForm({ ...doshaForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label className="label">Price (₹)</label><input className="input" type="number" value={doshaForm.price} onChange={e => setDoshaForm({ ...doshaForm, price: e.target.value })} /></div>
                            <div><label className="label">Icon</label><input className="input" value={doshaForm.icon} onChange={e => setDoshaForm({ ...doshaForm, icon: e.target.value })} /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label className="label">Duration</label><input className="input" value={doshaForm.duration} onChange={e => setDoshaForm({ ...doshaForm, duration: e.target.value })} /></div>
                            <div><label className="label">Participant Limit</label><input className="input" type="number" placeholder="No Limit" value={doshaForm.participantLimit} onChange={e => setDoshaForm({ ...doshaForm, participantLimit: e.target.value })} /></div>
                        </div>
                        <label className="label">Description</label>
                        <textarea className="input" value={doshaForm.description} onChange={e => setDoshaForm({ ...doshaForm, description: e.target.value })} rows={2} />
                        <label className="label">Remedies (comma-separated)</label>
                        <input className="input" value={doshaForm.remedies} onChange={e => setDoshaForm({ ...doshaForm, remedies: e.target.value })} />
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowDoshaModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            <button onClick={saveDosha} className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* EPUJA MODAL */}
            {showEPujaModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ maxWidth: '500px', margin: '1rem', maxHeight: '90vh', overflow: 'auto' }}>
                        <h3 style={{ marginBottom: '1rem' }}>{editingEPuja ? 'Edit e-Puja' : 'Add e-Puja'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label className="label">Name *</label><input className="input" value={epujaForm.name} onChange={e => setEpujaForm({ ...epujaForm, name: e.target.value })} /></div>
                            <div><label className="label">Slug *</label><input className="input" value={epujaForm.slug} onChange={e => setEpujaForm({ ...epujaForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div><label className="label">Price (₹)</label><input className="input" type="number" value={epujaForm.price} onChange={e => setEpujaForm({ ...epujaForm, price: e.target.value })} /></div>
                            <div><label className="label">Icon</label><input className="input" value={epujaForm.icon} onChange={e => setEpujaForm({ ...epujaForm, icon: e.target.value })} /></div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                            <div><label className="label">Type</label>
                                <select className="input" value={epujaForm.priceType} onChange={e => setEpujaForm({ ...epujaForm, priceType: e.target.value })}>
                                    <option value="fixed">Fixed</option>
                                    <option value="starting">Starting</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            <div><label className="label">Tag</label><input className="input" value={epujaForm.tag} onChange={e => setEpujaForm({ ...epujaForm, tag: e.target.value })} /></div>
                            <div><label className="label">Part. Limit</label><input className="input" type="number" placeholder="No Limit" value={epujaForm.participantLimit} onChange={e => setEpujaForm({ ...epujaForm, participantLimit: e.target.value })} /></div>
                        </div>
                        <label className="label">Description</label>
                        <textarea className="input" value={epujaForm.description} onChange={e => setEpujaForm({ ...epujaForm, description: e.target.value })} rows={2} />
                        <label className="label">Features (comma-separated)</label>
                        <input className="input" value={epujaForm.features} onChange={e => setEpujaForm({ ...epujaForm, features: e.target.value })} />
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button onClick={() => setShowEPujaModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            <button onClick={saveEPuja} className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ASSIGN PANDIT MODAL */}
            {selectedBooking && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ maxWidth: '500px', margin: '1rem', maxHeight: '80vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3>Assign Pandit - #{selectedBooking.id}</h3>
                            <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#F9FAFB', borderRadius: '8px' }}>
                            <strong>{selectedBooking.ceremonyType}</strong>
                            <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{selectedBooking.date} at {selectedBooking.time}</div>
                        </div>
                        {[...availablePandits.availablePandits, ...availablePandits.unscheduledPandits].map(p => (
                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #E5E7EB', borderRadius: '8px', marginBottom: '0.5rem' }}>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{p.specialization}</div>
                                </div>
                                <button onClick={() => assignPandit(selectedBooking.id, p.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }}>Assign</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem' }}>Site Settings</h2>

                    {/* WhatsApp Number */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '0.75rem' }}>WhatsApp Support Number</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                            This number will be used for the WhatsApp button across the site.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '400px' }}>
                            <input
                                type="text"
                                value={siteSettings.whatsappNumber}
                                onChange={e => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })}
                                placeholder="e.g., 919876543210"
                                style={{ flex: 1, padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                            />
                        </div>
                    </div>

                    {/* Puja Locations */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '0.75rem' }}>Puja Locations</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                            Manage available locations where pujas can be performed.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', maxWidth: '400px' }}>
                            <input
                                type="text"
                                value={newLocation}
                                onChange={e => setNewLocation(e.target.value)}
                                placeholder="Add new location"
                                style={{ flex: 1, padding: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && newLocation.trim()) {
                                        setSiteSettings({ ...siteSettings, pujaLocations: [...siteSettings.pujaLocations, newLocation.trim()] });
                                        setNewLocation('');
                                    }
                                }}
                            />
                            <button
                                className="btn btn-outline"
                                onClick={() => {
                                    if (newLocation.trim()) {
                                        setSiteSettings({ ...siteSettings, pujaLocations: [...siteSettings.pujaLocations, newLocation.trim()] });
                                        setNewLocation('');
                                    }
                                }}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {siteSettings.pujaLocations.map((loc, i) => (
                                <span key={i} style={{
                                    background: '#E8F5E9',
                                    color: '#2E7D32',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    {loc}
                                    <button
                                        onClick={() => setSiteSettings({ ...siteSettings, pujaLocations: siteSettings.pujaLocations.filter((_, idx) => idx !== i) })}
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', padding: 0 }}
                                    >×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        className="btn btn-primary"
                        disabled={savingSettings}
                        onClick={async () => {
                            setSavingSettings(true);
                            try {
                                const token = localStorage.getItem('token');
                                await axios.post(`${apiUrl}/api/settings/bulk`, {
                                    settings: [
                                        { key: 'whatsappNumber', value: siteSettings.whatsappNumber, type: 'string' },
                                        { key: 'pujaLocations', value: siteSettings.pujaLocations, type: 'json' }
                                    ]
                                }, { headers: { Authorization: `Bearer ${token}` } });
                                setSuccessMessage('Settings saved successfully!');
                                setTimeout(() => setSuccessMessage(''), 3000);
                            } catch (err) {
                                setError(err.response?.data?.error || 'Error saving settings');
                                setTimeout(() => setError(''), 5000);
                            } finally {
                                setSavingSettings(false);
                            }
                        }}
                    >
                        {savingSettings ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
