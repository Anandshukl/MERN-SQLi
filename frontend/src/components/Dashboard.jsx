import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Copy,
  Check,
  Search,
  Clock,
  Activity,
  Shield,
  AlertTriangle,
  Database,
} from 'lucide-react';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch scan history
  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/detect/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/detect/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const handleScan = async () => {
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setScanResult(null);
    setCopied(false);

    try {
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        throw new Error('Analysis request failed');
      }

      const data = await res.json();
      setScanResult(data);

      // Refresh history and stats
      fetchHistory();
      fetchStats();
    } catch (err) {
      setScanResult({
        detected: 'safe',
        explanation: `Error: ${err.message}. Please check if the backend server is running.`,
        ml_score: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setScanResult(null);
    setCopied(false);
  };

  const handleCopyResult = () => {
    if (!scanResult) return;

    const summary = [
      `Query: ${query.trim()}`,
      `Status: ${scanResult.detected.toUpperCase()}`,
      `Explanation: ${scanResult.explanation}`,
      scanResult.ml_score !== null ? `Confidence: ${(scanResult.ml_score * 100).toFixed(1)}%` : '',
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard
      .writeText(summary)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error('Copy failed:', err));
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleScan();
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <main className="main-content">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">SQLi-Guardian Analyzer</h1>
        <p className="dashboard-subtitle">
          Submit SQL queries to evaluate potential injection vulnerabilities using advanced pattern detection.
        </p>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Activity size={22} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{stats.totalScans}</div>
              <div className="stat-label">Total Scans</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <ShieldCheck size={22} />
            </div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: 'var(--safe)' }}>
                {stats.safeCount}
              </div>
              <div className="stat-label">Safe Queries</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon red">
              <AlertTriangle size={22} />
            </div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: 'var(--vuln)' }}>
                {stats.vulnerableCount}
              </div>
              <div className="stat-label">Threats Detected</div>
            </div>
          </div>
        </div>
      )}

      {/* Scan Input Panel */}
      <div className="glass-panel">
        <div className="scan-container">
          <label className="input-label" htmlFor="sql-input">
            <Database size={14} />
            Query Under Inspection
          </label>

          <div className="textarea-wrapper">
            <textarea
              id="sql-input"
              className="sql-textarea"
              placeholder="SELECT * FROM users WHERE username = 'admin' AND password = 'password'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <div className="actions-row">
            <div className="button-group">
              <button
                id="btn-reset"
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={loading || !query}
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>

              {scanResult && (
                <button
                  id="btn-copy"
                  className="btn btn-secondary"
                  onClick={handleCopyResult}
                  disabled={loading}
                >
                  {copied ? (
                    <Check size={15} style={{ color: 'var(--safe)' }} />
                  ) : (
                    <Copy size={15} />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy Report'}</span>
                </button>
              )}
            </div>

            <button
              id="btn-scan"
              className="btn btn-primary"
              onClick={handleScan}
              disabled={loading || !query.trim()}
            >
              {loading ? (
                <span className="scanning-indicator">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                  Analyzing...
                </span>
              ) : (
                <>
                  <Search size={16} />
                  <span>Detect SQLi</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scan Results */}
        {scanResult && (
          <div className={`scan-result-card ${scanResult.detected}`}>
            <div className={`result-header ${scanResult.detected}`}>
              {scanResult.detected === 'vulnerable' ? (
                <>
                  <ShieldAlert size={22} />
                  <span>⚠️ SQL Injection Detected!</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={22} />
                  <span>✅ Query Appears Safe</span>
                </>
              )}
            </div>

            <div className="result-explanation">{scanResult.explanation}</div>

            {scanResult.ml_score !== null && (
              <div className="result-meta">
                <span>Detection Confidence</span>
                <div className="confidence-bar-wrapper">
                  <div className="confidence-bar">
                    <div
                      className={`confidence-fill ${scanResult.detected}`}
                      style={{ width: `${(scanResult.ml_score * 100).toFixed(0)}%` }}
                    />
                  </div>
                  <span
                    className="confidence-label"
                    style={{
                      color:
                        scanResult.detected === 'vulnerable'
                          ? 'var(--vuln)'
                          : 'var(--safe)',
                    }}
                  >
                    {(scanResult.ml_score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Section */}
      <div>
        <h2 className="history-section-title">
          <Clock size={18} />
          Recent Scan History
        </h2>

        {history.length > 0 ? (
          <div className="history-list">
            {history.map((item) => (
              <div key={item._id} className="history-item">
                <div className="history-item-top">
                  <div className="history-query-text">{item.queryText}</div>
                  <span
                    className={`badge ${
                      item.detected === 'vulnerable'
                        ? 'badge-vulnerable'
                        : 'badge-safe'
                    }`}
                  >
                    {item.detected}
                  </span>
                </div>

                <div className="history-item-bottom">
                  <div className="history-explanation">{item.explanation}</div>
                  <div className="history-time">
                    <Clock size={11} />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-text">
              No scans recorded yet. Submit a SQL query above to get started.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
