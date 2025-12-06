import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import UserDashboard from './pages/UserDashboard';
import PanditDashboard from './pages/PanditDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import CeremonyDetails from './pages/CeremonyDetails';
import ModernBooking from './pages/ModernBooking';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import { About, Contact, RegisterPandit, Feedback, Blog, Terms, Privacy } from './pages/StaticPages';
import Footer from './components/Footer';

function App() {
  const { loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/dashboard" element={
          <ProtectedRoute roles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/pandit" element={
          <ProtectedRoute roles={['pandit']}>
            <PanditDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/" element={<LandingPage />} />

        <Route path="/ceremony/:id" element={<CeremonyDetails />} />
        <Route path="/modern" element={<ModernBooking />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register-pandit" element={<RegisterPandit />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

      </Routes>
      <Footer />
    </>
  );
}

export default App;
