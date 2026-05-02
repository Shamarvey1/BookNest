import React, { useEffect, useState } from "react";
import { Crown, Check, Zap, Bookmark, BookOpen } from "lucide-react";
import "./Premium.css";

function loadUser() {
  try {
    const raw = localStorage.getItem("booknest_user");
    if (!raw) return { name: "You", isPremium: false };
    return JSON.parse(raw);
  } catch (e) {
    return { name: "You", isPremium: false };
  }
}

function saveUser(user) {
  try {
    localStorage.setItem("booknest_user", JSON.stringify(user));
  } catch (e) {}
}

export default function Premium() {
  const [user, setUser] = useState(loadUser());

  useEffect(() => {
    setUser(loadUser());
  }, []);

  const handleUpgrade = () => {
    const updated = { ...user, isPremium: true, plan: "Premium", validTill: "2027-05-02" };
    saveUser(updated);
    setUser(updated);
  };

  const handleCancel = () => {
    const updated = { ...user, isPremium: false };
    saveUser(updated);
    setUser(updated);
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
              <strong>{user.validTill || "2027-05-02"}</strong>
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