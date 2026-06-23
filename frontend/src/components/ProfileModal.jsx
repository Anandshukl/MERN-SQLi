import React, { useEffect, useState } from 'react';
import { X, Award } from 'lucide-react';

export default function ProfileModal({ onClose }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        setLoading(false);
      });
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🛡️ Team Profile</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 16px' }} />
              <div style={{ color: 'var(--primary)', fontSize: '0.92rem' }}>
                Loading team profile...
              </div>
            </div>
          ) : profileData ? (
            <div>
              <div className="profile-institute">{profileData.institute}</div>

              <h4
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-muted)',
                }}
              >
                Project Development Team ({profileData.team})
              </h4>

              <div className="members-grid">
                {profileData.students.map((student) => (
                  <div key={student.id} className="member-card">
                    <div className="member-avatar">
                      {student.name.charAt(0)}
                    </div>
                    <div className="member-name">{student.name}</div>
                    <div className="member-id">{student.id}</div>
                  </div>
                ))}
              </div>

              <div className="guided-by">
                <Award
                  size={18}
                  style={{ verticalAlign: 'middle', marginRight: '6px' }}
                />
                {profileData.guided_by}
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '32px',
                color: 'var(--vuln)',
              }}
            >
              Error loading project profile.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
