import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, LogOut, RefreshCw, CheckCircle, XCircle, Clock,
  FileText, User, Mail, Phone, Image as ImageIcon, Video,
  IndianRupee, Calendar, Search, Filter
} from 'lucide-react';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [quoteAmounts, setQuoteAmounts] = useState({}); // Store price inputs for each quotation

  // Check if admin is logged in
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn !== 'true') {
      navigate('/login'); // Redirect to main login if not authenticated
    } else {
      fetchQuotations();
    }
  }, [navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5002/api/shop/admin/quotations', {
        headers: {
          'x-admin-auth': 'true'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setQuotations(data.quotations);
      }
    } catch (error) {
      console.error('Failed to fetch quotations:', error);
      showToast('Failed to fetch quotations', 'error');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/login');
  };

  const handleAmountChange = (id, value) => {
    setQuoteAmounts(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleApprove = async (id) => {
    const amount = quoteAmounts[id];
    if (!amount || amount <= 0) {
      showToast('Please enter a valid quotation amount', 'error');
      return;
    }

    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:5002/api/shop/admin/quotations/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'true'
        },
        body: JSON.stringify({ amount: amount })
      });

      const data = await response.json();
      if (response.ok) {
        showToast('Quotation approved and PDF sent successfully', 'success');
        fetchQuotations();
      } else {
        showToast(data.message || 'Failed to approve', 'error');
      }
    } catch (error) {
      showToast('Failed to approve quotation', 'error');
    }
    setActionLoading(null);
  };

  const handleDecline = async (id) => {
    if (!window.confirm('Are you sure you want to decline this request?')) return;

    setActionLoading(id);
    try {
      const response = await fetch(`http://localhost:5002/api/shop/admin/quotations/${id}/decline`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': 'true'
        },
        body: JSON.stringify({ notes: 'Declined by admin' })
      });

      const data = await response.json();
      if (response.ok) {
        showToast('Quotation declined', 'success'); // Changed to success type for green styling
        fetchQuotations();
      } else {
        showToast(data.message || 'Failed to decline', 'error');
      }
    } catch (error) {
      showToast('Failed to decline quotation', 'error');
    }
    setActionLoading(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending"><Clock size={14} /> Pending</span>;
      case 'approved':
        return <span className="status-badge approved"><CheckCircle size={14} /> Approved</span>;
      case 'declined':
        return <span className="status-badge declined"><XCircle size={14} /> Declined</span>;
      default:
        return <span className="status-badge default">{status}</span>;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="brand">
            <Shield className="brand-icon" size={28} />
            <div>
              <h1>Admin Portal</h1>
              <p>Quotation Management System</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button onClick={fetchQuotations} className="btn btn-outline" disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
            Refresh
          </button>
          <button onClick={handleLogout} className="btn btn-danger">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* Dashboard Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon pending-bg">
            <Clock size={24} />
          </div>
          <div>
            <h3>{quotations.filter(q => q.status === 'pending').length}</h3>
            <p>Pending Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success-bg">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3>{quotations.filter(q => q.status === 'approved').length}</h3>
            <p>Approved Quotes</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon error-bg">
            <XCircle size={24} />
          </div>
          <div>
            <h3>{quotations.filter(q => q.status === 'declined').length}</h3>
            <p>Declined Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total-bg">
            <FileText size={24} />
          </div>
          <div>
            <h3>{quotations.length}</h3>
            <p>Total Requests</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-area">
        <div className="section-header">
          <h2>Requests Overview</h2>
        </div>

        {loading && quotations.length === 0 ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading data...</p>
          </div>
        ) : quotations.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} className="text-muted" />
            <h3>No Requests Found</h3>
            <p>New quotation requests will appear here.</p>
          </div>
        ) : (
          <div className="quotations-grid">
            {quotations.map((quotation) => (
              <div key={quotation._id} className={`quotation-card ${quotation.status}`}>
                <div className="card-header">
                  <div className="header-top">
                    <span className="id-badge">#{quotation._id.slice(-6).toUpperCase()}</span>
                    {getStatusBadge(quotation.status)}
                  </div>
                  <h3 className="product-title">{quotation.productName}</h3>
                  <div className="date-badge">
                    <Calendar size={14} />
                    {new Date(quotation.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-group">
                    <div className="info-item">
                      <User size={16} />
                      <span>{quotation.userName}</span>
                    </div>
                    <div className="info-item">
                      <Mail size={16} />
                      <span>{quotation.email}</span>
                    </div>
                    <div className="info-item">
                      <Phone size={16} />
                      <span>{quotation.phone}</span>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <div className="media-preview">
                    <h4>Attached Media</h4>
                    <div className="media-grid">
                      <div className="media-item" onClick={() => setSelectedImage(`http://localhost:5002/api/shop/uploads/${quotation.frontViewImage}`)}>
                        <img src={`http://localhost:5002/api/shop/uploads/${quotation.frontViewImage}`} alt="Front" onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=No+Img'} />
                        <span>Front View</span>
                      </div>
                      <div className="media-item" onClick={() => setSelectedImage(`http://localhost:5002/api/shop/uploads/${quotation.topViewImage}`)}>
                        <img src={`http://localhost:5002/api/shop/uploads/${quotation.topViewImage}`} alt="Top" onError={(e) => e.target.src = 'https://via.placeholder.com/100?text=No+Img'} />
                        <span>Top View</span>
                      </div>
                    </div>
                    {quotation.videoPath && (
                      <div className="video-link">
                        <Video size={16} />
                        <a href={`http://localhost:5002/api/shop/uploads/${quotation.videoPath}`} target="_blank" rel="noopener noreferrer">View Video</a>
                      </div>
                    )}
                  </div>

                  {quotation.status === 'pending' && (
                    <div className="action-area">
                      <div className="price-input-wrapper">
                        <IndianRupee size={16} className="currency-icon" />
                        <input
                          type="number"
                          placeholder="Enter Quote Amount"
                          className="price-input"
                          value={quoteAmounts[quotation._id] || ''}
                          onChange={(e) => handleAmountChange(quotation._id, e.target.value)}
                        />
                      </div>
                      <div className="button-group">
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(quotation._id)}
                          disabled={actionLoading === quotation._id}
                        >
                          {actionLoading === quotation._id ? 'Processing...' : 'Approve & Send'}
                        </button>
                        <button
                          className="btn-decline"
                          onClick={() => handleDecline(quotation._id)}
                          disabled={actionLoading === quotation._id}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>
              <XCircle size={24} />
            </button>
            <img src={selectedImage} alt="Full View" />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      <style>{`
                :root {
                    --primary: #2563eb;
                    --primary-dark: #1e40af;
                    --success: #059669;
                    --danger: #dc2626;
                    --bg-gray: #f3f4f6;
                    --border: #e5e7eb;
                    --text-main: #1f2937;
                    --text-muted: #6b7280;
                }

                .admin-dashboard {
                    background: linear-gradient(135deg, #faf8f0 0%, #f5f3e6 50%, #f0eedf 100%);
                    min-height: 100vh;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    padding-bottom: 40px;
                    position: relative;
                }

                .admin-header {
                    background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #3b7dab 100%);
                    padding: 1.25rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .header-left .brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .brand-icon {
                    color: #fff;
                    background: linear-gradient(135deg, #ffd700, #ffb347);
                    padding: 8px;
                    border-radius: 10px;
                }

                .header-left h1 {
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .header-left p {
                    font-size: 0.875rem;
                    color: rgba(255,255,255,0.9);
                    margin: 0;
                }

                .header-right {
                    display: flex;
                    gap: 12px;
                }

                .btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.875rem;
                    border: 1px solid transparent;
                }

                .btn-outline {
                    background: white;
                    border-color: var(--border);
                    color: var(--text-main);
                }

                .btn-outline:hover {
                    background: var(--bg-gray);
                }

                .btn-danger {
                    background: #fee2e2;
                    color: var(--danger);
                }

                .btn-danger:hover {
                    background: #fecaca;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 20px;
                    padding: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .stat-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    padding: 1.75rem;
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border: 1px solid rgba(255,255,255,0.3);
                }

                .stat-card:hover {
                    transform: translateY(-10px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                }

                /* Colorful Stat Cards with Vibrant Gradients */
                .stat-card:nth-child(1) { 
                    background: linear-gradient(135deg, #fff4e6 0%, #ffe8cc 100%);
                    border-left: 6px solid #f59e0b;
                    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.25);
                } /* Pending */
                .stat-card:nth-child(2) { 
                    background: linear-gradient(135deg, #e6fff9 0%, #ccffe6 100%);
                    border-left: 6px solid #10b981;
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
                } /* Approved */
                .stat-card:nth-child(3) { 
                    background: linear-gradient(135deg, #fff0f0 0%, #ffe6e6 100%);
                    border-left: 6px solid #ef4444;
                    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.25);
                } /* Declined */
                .stat-card:nth-child(4) { 
                    background: linear-gradient(135deg, #e6f0ff 0%, #cce0ff 100%);
                    border-left: 6px solid #3b82f6;
                    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
                } /* Total */

                .stat-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }

                .pending-bg { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; }
                .success-bg { background: linear-gradient(135deg, #34d399, #10b981); color: white; }
                .error-bg { background: linear-gradient(135deg, #f87171, #ef4444); color: white; }
                .total-bg { background: linear-gradient(135deg, #60a5fa, #3b82f6); color: white; }

                .stat-card h3 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin: 0;
                    color: var(--text-main);
                }

                .stat-card p {
                    margin: 0;
                    color: var(--text-muted);
                    font-size: 0.875rem;
                }

                .content-area {
                    padding: 0 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .section-header {
                    margin-bottom: 24px;
                    background: rgba(255,255,255,0.7);
                    backdrop-filter: blur(10px);
                    padding: 16px 24px;
                    border-radius: 12px;
                    border: 1px solid rgba(0,0,0,0.05);
                }

                .section-header h2 {
                    color: #1f2937;
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 600;
                }

                .quotations-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
                    gap: 24px;
                    justify-content: center;
                }

                .quotation-card {
                    background: white;
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.12);
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.3);
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .quotation-card:hover {
                    transform: translateY(-8px) scale(1.01);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                }

                .quotation-card.pending { 
                    border-left: 6px solid #f59e0b;
                    box-shadow: 0 10px 40px rgba(245, 158, 11, 0.15);
                }
                .quotation-card.approved { 
                    border-left: 6px solid #10b981;
                    box-shadow: 0 10px 40px rgba(16, 185, 129, 0.15);
                }
                .quotation-card.declined { 
                    border-left: 6px solid #ef4444; 
                    opacity: 0.9;
                    box-shadow: 0 10px 40px rgba(239, 68, 68, 0.15);
                }

                .card-header {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                    transition: background-color 0.3s ease;
                }

                /* Colorful Headers based on parent status */
                .quotation-card.pending .card-header { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); }
                .quotation-card.approved .card-header { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); }
                .quotation-card.declined .card-header { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); }

                .header-top {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }

                .id-badge {
                    font-family: monospace;
                    background: #e5e7eb;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }

                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                }

                .status-badge.pending { background: #fef3c7; color: #b45309; }
                .status-badge.approved { background: #d1fae5; color: #065f46; }
                .status-badge.declined { background: #fee2e2; color: #991b1b; }

                .product-title {
                    margin: 0 0 10px 0;
                    font-size: 1.15rem;
                    font-weight: 600;
                    color: var(--text-main);
                    line-height: 1.4;
                    text-align: center;
                }

                .date-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }

                .card-body {
                    padding: 1.5rem;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .info-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    background: #f9fafb;
                    padding: 14px 16px;
                    border-radius: 10px;
                }

                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--text-main);
                    font-size: 0.9rem;
                }

                .info-item svg {
                    color: #6b7280;
                    flex-shrink: 0;
                }

                .divider {
                    height: 1px;
                    background: var(--border);
                    margin: 1rem 0;
                }

                .media-preview h4 {
                    font-size: 0.8rem;
                    color: #9ca3af;
                    margin: 0 0 12px 0;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    text-align: center;
                    font-weight: 500;
                }

                .media-grid {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                .media-item {
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                    background: #f3f4f6;
                    border: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    overflow: hidden;
                    position: relative;
                }

                .media-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .media-item span {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    background: rgba(0,0,0,0.6);
                    color: white;
                    font-size: 9px;
                    text-align: center;
                    padding: 2px 0;
                }

                .video-link {
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.875rem;
                }

                .video-link a {
                    color: var(--primary);
                    text-decoration: none;
                }

                .video-link a:hover {
                    text-decoration: underline;
                }

                .action-area {
                    margin-top: auto;
                    padding-top: 1.25rem;
                    background: linear-gradient(180deg, transparent 0%, rgba(249, 250, 251, 0.8) 100%);
                    padding: 1.25rem;
                    margin: 0 -1.25rem -1.25rem -1.25rem;
                    border-radius: 0 0 16px 16px;
                }

                .price-input-wrapper {
                    position: relative;
                    margin-bottom: 16px;
                }

                .currency-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6b7280;
                }

                .price-input {
                    width: 100%;
                    padding: 12px 12px 12px 36px;
                    border: 2px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 500;
                    outline: none;
                    transition: all 0.3s ease;
                    background: #fafafa;
                }

                .price-input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
                    background: white;
                }

                .price-input::placeholder {
                    color: #9ca3af;
                    font-weight: 400;
                }

                .button-group {
                    display: flex;
                    gap: 12px;
                    margin-top: 12px;
                }
                
                .button-group button {
                    flex: 1;
                    min-width: 120px;
                }

                .btn-approve, .btn-decline {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .btn-approve {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }

                .btn-approve:hover {
                    background: linear-gradient(135deg, #059669 0%, #047857 100%);
                    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
                    transform: translateY(-2px);
                }

                .btn-decline {
                    background: white;
                    border: 2px solid #ef4444;
                    color: #ef4444;
                }

                .btn-decline:hover {
                    background: #fef2f2;
                    transform: translateY(-2px);
                }

                .btn-approve:disabled, .btn-decline:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    backdrop-filter: blur(5px);
                }

                .modal-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90vh;
                }

                .modal-content img {
                    max-width: 100%;
                    max-height: 90vh;
                    border-radius: 8px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }

                .modal-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                }

                .custom-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 500;
                    z-index: 2000;
                    animation: slideUp 0.3s ease-out;
                }

                .custom-toast.success { border-left: 4px solid var(--success); }
                .custom-toast.error { border-left: 4px solid var(--danger); }
                .custom-toast.success svg { color: var(--success); }
                .custom-toast.error svg { color: var(--danger); }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @media (max-width: 768px) {
                    .header-left p { display: none; }
                    .stats-grid { grid-template-columns: 1fr 1fr; }
                    .quotations-grid { grid-template-columns: 1fr; }
                }
            `}</style>
    </div>
  );
};

export default AdminPanel;
