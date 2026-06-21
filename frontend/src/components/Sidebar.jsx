import React from 'react';
import { Shield, User, Library, LogOut } from 'lucide-react';

export default function Sidebar({ username, onLogout, onOpenProfile, onOpenPayloads }) {
  return (
    <aside className="app-sidebar" id="sidebar">
      <div className="profile-section">
        <div className="avatar-wrapper">
          <div className="avatar-inner">
            <span>🛡️</span>
          </div>
        </div>
        <h2 className="profile-username">{username || 'Analyst'}</h2>
        <span className="profile-role">Security Auditor</span>
      </div>

      <nav className="sidebar-menu">
        <button id="menu-analyzer" className="menu-item active">
          <Shield size={18} />
          <span>SQLi Analyzer</span>
        </button>

        <button id="menu-profile" className="menu-item" onClick={onOpenProfile}>
          <User size={18} />
          <span>Team Profile</span>
        </button>

        <button id="menu-payloads" className="menu-item" onClick={onOpenPayloads}>
          <Library size={18} />
          <span>Payloads Library</span>
        </button>

        <button id="menu-logout" className="menu-item logout-button" onClick={onLogout}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}
