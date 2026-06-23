import React, { useState } from 'react';
import { ShieldCheck, User, Lock, ArrowRight } from 'lucide-react';

export default function Auth({ onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState('login');

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      onAuthSuccess(data.username);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (regPassword !== regConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (regPassword.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regUsername,
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || 'Registration failed');
      }

      setSuccess('Account created successfully! Please sign in.');
      setActiveTab('login');
      setLoginUsername(regUsername);
      setRegUsername('');
      setRegPassword('');
      setRegConfirm('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🛡️</div>
          <h1 className="auth-title">SQLi-Guardian</h1>
          <p className="auth-subtitle">AI-Driven SQL Injection Protection</p>
        </div>

        <div className="auth-tabs">
          <button
            id="tab-login"
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => toggleTab('login')}
          >
            Sign In
          </button>
          <button
            id="tab-register"
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => toggleTab('register')}
          >
            Create Account
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        {activeTab === 'login' ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-username">Username</label>
              <div className="form-input-wrapper">
                <User size={18} className="form-input-icon" />
                <input
                  id="login-username"
                  type="text"
                  className="form-input"
                  placeholder="Enter your username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="form-input-wrapper">
                <Lock size={18} className="form-input-icon" />
                <input
                  id="login-password"
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              id="btn-login"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-username">Choose Username</label>
              <div className="form-input-wrapper">
                <User size={18} className="form-input-icon" />
                <input
                  id="reg-username"
                  type="text"
                  className="form-input"
                  placeholder="Choose an auditor name"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="form-input-wrapper">
                <Lock size={18} className="form-input-icon" />
                <input
                  id="reg-password"
                  type="password"
                  className="form-input"
                  placeholder="Choose strong password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <div className="form-input-wrapper">
                <Lock size={18} className="form-input-icon" />
                <input
                  id="reg-confirm"
                  type="password"
                  className="form-input"
                  placeholder="Repeat selected password"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              id="btn-register"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register Account'}
              <ShieldCheck size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
