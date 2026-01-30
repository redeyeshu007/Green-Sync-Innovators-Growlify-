import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  LogOut,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Mail,
  Phone,
  Video,
  IndianRupee,
  Calendar
} from "lucide-react";

const AdminPanel = () => {
  const navigate = useNavigate();

  /* -------------------- State -------------------- */
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [priceInputs, setPriceInputs] = useState({});
  const [toast, setToast] = useState({
    visible: false,
    text: "",
    variant: "success",
  });

  /* -------------------- Auth Check -------------------- */
  useEffect(() => {
    const isAdmin = localStorage.getItem("adminLoggedIn");
    if (isAdmin !== "true") {
      navigate("/login");
    } else {
      loadQuotations();
    }
  }, [navigate]);

  /* -------------------- Helpers -------------------- */
  const notify = (text, variant = "success") => {
    setToast({ visible: true, text, variant });
    setTimeout(
      () => setToast({ visible: false, text: "", variant: "success" }),
      4000
    );
  };

  const loadQuotations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5002/api/shop/admin/quotations",
        { headers: { "x-admin-auth": "true" } }
      );
      const json = await res.json();
      if (res.ok) setRequests(json.quotations);
    } catch {
      notify("Unable to fetch quotation data", "error");
    }
    setIsLoading(false);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/login");
  };

  /* -------------------- Actions -------------------- */
  const updateAmount = (id, value) => {
    setPriceInputs((prev) => ({ ...prev, [id]: value }));
  };

  const approveRequest = async (id) => {
    const amount = priceInputs[id];
    if (!amount || amount <= 0) {
      notify("Enter a valid quotation amount", "error");
      return;
    }

    setActiveAction(id);
    try {
      const res = await fetch(
        `http://localhost:5002/api/shop/admin/quotations/${id}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-auth": "true",
          },
          body: JSON.stringify({ amount }),
        }
      );

      const json = await res.json();
      if (res.ok) {
        notify("Quotation approved and sent to user");
        loadQuotations();
      } else {
        notify(json.message || "Approval failed", "error");
      }
    } catch {
      notify("Approval request failed", "error");
    }
    setActiveAction(null);
  };

  const declineRequest = async (id) => {
    if (!window.confirm("Decline this quotation request?")) return;

    setActiveAction(id);
    try {
      const res = await fetch(
        `http://localhost:5002/api/shop/admin/quotations/${id}/decline`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-auth": "true",
          },
          body: JSON.stringify({ notes: "Declined by admin" }),
        }
      );

      if (res.ok) {
        notify("Quotation declined");
        loadQuotations();
      } else {
        notify("Unable to decline quotation", "error");
      }
    } catch {
      notify("Decline request failed", "error");
    }
    setActiveAction(null);
  };

  const renderStatus = (status) => {
    if (status === "pending")
      return (
        <span className="status-badge pending">
          <Clock size={14} /> Pending
        </span>
      );
    if (status === "approved")
      return (
        <span className="status-badge approved">
          <CheckCircle size={14} /> Approved
        </span>
      );
    if (status === "declined")
      return (
        <span className="status-badge declined">
          <XCircle size={14} /> Declined
        </span>
      );
    return null;
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="brand">
          <Shield size={28} />
          <div>
            <h1>Admin Portal</h1>
            <p>Quotation Management</p>
          </div>
        </div>

        <div className="header-actions">
          <button onClick={loadQuotations} disabled={isLoading}>
            <RefreshCw className={isLoading ? "spin" : ""} /> Refresh
          </button>
          <button onClick={logoutAdmin} className="danger">
            <LogOut /> Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <section className="stats-grid">
        <Stat title="Pending" value={requests.filter(r => r.status === "pending").length} icon={<Clock />} />
        <Stat title="Approved" value={requests.filter(r => r.status === "approved").length} icon={<CheckCircle />} />
        <Stat title="Declined" value={requests.filter(r => r.status === "declined").length} icon={<XCircle />} />
        <Stat title="Total" value={requests.length} icon={<FileText />} />
      </section>

      {/* Requests */}
      <main className="content-area">
        {isLoading && requests.length === 0 ? (
          <p className="loading">Loading quotations...</p>
        ) : requests.length === 0 ? (
          <p className="empty">No quotation requests yet</p>
        ) : (
          <div className="quotations-grid">
            {requests.map((q) => (
              <div key={q._id} className={`quotation-card ${q.status}`}>
                <div className="card-header">
                  <span className="id-badge">#{q._id.slice(-6)}</span>
                  {renderStatus(q.status)}
                  <h3>{q.productName}</h3>
                  <div className="date">
                    <Calendar size={14} />
                    {new Date(q.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="card-body">
                  <p><User /> {q.userName}</p>
                  <p><Mail /> {q.email}</p>
                  <p><Phone /> {q.phone}</p>

                  {q.status === "pending" && (
                    <>
                      <div className="price-box">
                        <IndianRupee />
                        <input
                          type="number"
                          placeholder="Quote amount"
                          value={priceInputs[q._id] || ""}
                          onChange={(e) =>
                            updateAmount(q._id, e.target.value)
                          }
                        />
                      </div>

                      <div className="action-buttons">
                        <button
                          onClick={() => approveRequest(q._id)}
                          disabled={activeAction === q._id}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => declineRequest(q._id)}
                          disabled={activeAction === q._id}
                          className="danger"
                        >
                          Decline
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Toast */}
      {toast.visible && (
        <div className={`custom-toast ${toast.variant}`}>
          {toast.variant === "success" ? <CheckCircle /> : <XCircle />}
          {toast.text}
        </div>
      )}

      {/* Image Preview */}
      {previewImage && (
        <div className="modal" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Preview" />
        </div>
      )}
    </div>
  );
};

/* Small reusable stat component */
const Stat = ({ title, value, icon }) => (
  <div className="stat-card">
    <div className="icon">{icon}</div>
    <div>
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  </div>
);

export default AdminPanel;
