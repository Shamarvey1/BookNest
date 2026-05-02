import React, { useEffect, useState } from "react";
import { Crown, Check, Zap, Bookmark, BookOpen } from "lucide-react";
import "./Premium.css";
import { upgradePremium as serviceUpgrade, cancelPremium as serviceCancel } from "../../services/premiumService";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

async function fetchProfile() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  
  try {
    const res = await fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch profile:", e);
    return null;
  }
}

// upgrade/cancel handled by service file (premiumService)

export default function Premium() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const profile = await fetchProfile();
      setUser(profile || { name: "Guest", isPremium: false });
      setLoading(false);
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="premium-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "500px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  const handleUpgrade = async () => {
    const result = await serviceUpgrade();
    if (result) {
      setUser(result);
      alert("Upgrade successful! Welcome to Premium.");
    } else {
      alert("Upgrade failed. Please try again.");
    }
  };

  const handleCancel = async () => {
    const result = await serviceCancel();
    if (result) {
      setUser(result);
      alert("Premium subscription cancelled.");
    } else {
      alert("Cancellation failed. Please try again.");
    }
  };

  if (user.isPremium) {
    return (
      <div className="premium-page">
        <div className="premium-banner">
          <Crown size={32} style={{ marginBottom: "12px", margin: "0 auto 12px" }} />
          <h2>Welcome to Premium!</h2>
          <p>You're unlocking the full BookNest experience. Enjoy unlimited reading!</p>
        </div>

        <div className="premium-grid">
          <div className="card plan-card">
            <h3>Your Plan</h3>
            <div className="kv">
              <span>Plan Type</span>
              <strong>Premium</strong>
            </div>
            <div className="kv">
              <span>Status</span>
              <strong style={{ color: "#10b981" }}>Active</strong>
            </div>
            <div className="kv">
              <span>Valid Until</span>
              <strong>{user.validTill ? new Date(user.validTill).toLocaleDateString() : "Forever"}</strong>
            </div>
            <div className="card-actions">
              <button className="btn-primary">Manage Subscription</button>
              <button className="btn-ghost" onClick={handleCancel}>Cancel</button>
            </div>
          </div>

          <div className="card features-card">
            <h3>Unlocked Features</h3>
            <ul>
              <li>Dark Mode</li>
              <li>Unlimited Bookmarks</li>
              <li>Priority Support</li>
              <li>Offline Reading (Coming Soon)</li>
            </ul>

            <h4>Your Reading Stats</h4>
            <div className="stats">
              <div className="stat">
                <div className="num">12</div>
                <div className="label">Books Read</div>
              </div>
              <div className="stat">
                <div className="num">42h</div>
                <div className="label">Time Spent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-page">
      <div className="hero">
        <div>
          <h1>Unlock BookNest Premium</h1>
          <p>Experience unlimited reading with advanced features. Get access to dark mode, unlimited bookmarks, faster performance, and more!</p>
          
          <div className="pricing">
            <div className="price">
              <div className="amount">₹99</div>
              <div className="period">per month</div>
            </div>
            <div className="price">
              <div className="amount">₹499</div>
              <div className="period">per year</div>
            </div>
          </div>
          
          <button className="btn-primary" onClick={handleUpgrade}>
            <Crown size={18} style={{ marginRight: "8px", display: "inline" }} />
            Upgrade to Premium
          </button>
        </div>

        <div className="features">
          <div className="feature-card">
            <Zap size={24} style={{ color: "#2563eb", marginBottom: "8px" }} />
            <div className="title">Lightning Fast</div>
          </div>
          <div className="feature-card">
            <Bookmark size={24} style={{ color: "#2563eb", marginBottom: "8px" }} />
            <div className="title">Unlimited Bookmarks</div>
          </div>
          <div className="feature-card coming">
            <BookOpen size={24} style={{ color: "#9ca3af", marginBottom: "8px" }} />
            <div className="title">AI Reading Assistant</div>
            <div className="meta">Coming Soon</div>
          </div>
          <div className="feature-card">
            <Check size={24} style={{ color: "#2563eb", marginBottom: "8px" }} />
            <div className="title">Priority Support</div>
          </div>
        </div>
      </div>

      <div className="compare">
        <h3>Plan Comparison</h3>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Free</th>
              <th>Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Dark Mode</td>
              <td>Limited</td>
              <td>✓ Full Access</td>
            </tr>
            <tr>
              <td>Bookmarks</td>
              <td>Limited (50)</td>
              <td>✓ Unlimited</td>
            </tr>
            <tr>
              <td>Reading Speed</td>
              <td>Standard</td>
              <td>✓ Lightning Fast</td>
            </tr>
            <tr>
              <td>Offline Reading</td>
              <td>No</td>
              <td>✓ Coming Soon</td>
            </tr>
            <tr>
              <td>Priority Support</td>
              <td>No</td>
              <td>✓ Yes</td>
            </tr>
            <tr>
              <td>AI Assistant</td>
              <td>No</td>
              <td>✓ Coming Soon</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}