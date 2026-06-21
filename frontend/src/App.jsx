import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProfileModal from './components/ProfileModal';
import PayloadsModal from './components/PayloadsModal';

export default function App() {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [payloadsModalOpen, setPayloadsModalOpen] = useState(false);

  useEffect(() => {
    // Validate existing session token on mount
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');

    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setUsername(savedUsername || 'Analyst');
          } else {
            handleLogout();
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuthSuccess = (authUser) => {
    setUsername(authUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <div className="loading-text">Initializing SQLi-Guardian...</div>
      </div>
    );
  }

  // Not authenticated — show auth page
  if (!username) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Authenticated — show dashboard
  return (
    <div className="app-wrapper">
      <Sidebar
        username={username}
        onLogout={handleLogout}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenPayloads={() => setPayloadsModalOpen(true)}
      />

      <Dashboard />

      {profileModalOpen && (
        <ProfileModal onClose={() => setProfileModalOpen(false)} />
      )}

      {payloadsModalOpen && (
        <PayloadsModal onClose={() => setPayloadsModalOpen(false)} />
      )}
    </div>
  );
}
