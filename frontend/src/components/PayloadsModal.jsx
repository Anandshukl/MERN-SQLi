import React, { useEffect, useState } from 'react';
import { X, Copy, Check, ShieldAlert } from 'lucide-react';

export default function PayloadsModal({ onClose }) {
  const [payloads, setPayloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/api/payloads`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPayloads(data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load payloads:', err);
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

  const handleCopy = (text, id) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch((err) => console.error('Copy failed:', err));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            <ShieldAlert size={22} style={{ color: 'var(--vuln)' }} />
            SQL Injection Payloads Library
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="payloads-disclaimer">
            <strong>⚠️ Disclaimer:</strong> These payloads are provided
            strictly for educational and authorized security testing purposes.
            Do not use against unauthorized systems.
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div className="loading-spinner" style={{ margin: '0 auto 16px' }} />
              <div style={{ color: 'var(--primary)', fontSize: '0.92rem' }}>
                Loading payloads library...
              </div>
            </div>
          ) : payloads.length > 0 ? (
            <div>
              {payloads.map((category) => (
                <div key={category.id} className="payload-category-card">
                  <h3 className="payload-category-title">{category.title}</h3>
                  <p className="payload-category-desc">{category.description}</p>

                  <div className="payload-list">
                    {category.items.map((item, index) => {
                      const itemId = `${category.id}-${index}`;
                      return (
                        <div key={itemId} className="payload-item">
                          <div className="payload-code-row">
                            <code className="payload-code">{item.payload}</code>
                            <button
                              className="payload-copy-btn"
                              onClick={() => handleCopy(item.payload, itemId)}
                            >
                              {copiedId === itemId ? (
                                <>
                                  <Check size={12} />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={12} />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          {item.note && (
                            <div className="payload-note">{item.note}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '32px',
                color: 'var(--vuln)',
              }}
            >
              Failed to load payloads library.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
