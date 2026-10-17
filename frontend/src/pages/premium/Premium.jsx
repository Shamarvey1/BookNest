import React, { useEffect, useState } from "react";
import {
  Crown,
  Check,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Premium.css";
import { cancelPremium as serviceCancel } from "../../services/premiumService";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

async function fetchProfile() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("Failed to fetch profile:", e);
    return null;
  }
}

export default function Premium() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const profile = await fetchProfile();
      setUser(profile || { name: "Reader", isPremium: false, email: "" });
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleCheckout = () => {
    navigate(`/main/premium/checkout?plan=${selectedPlan}`);
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const result = await serviceCancel();
      if (result) {
        setUser((prev) => ({ ...prev, isPremium: false, plan: "free" }));
        setCancelModalOpen(false);
        setToast({
          type: "success",
          msg: "Your membership has been cancelled. You will remain on Free Reader tier.",
        });
      } else {
        setToast({
          type: "error",
          msg: "Failed to cancel membership. Please try again.",
        });
      }
    } catch (err) {
      setToast({
        type: "error",
        msg: "Error connecting to billing server.",
      });
    } finally {
      setCancelling(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new CustomEvent("tokenChanged", { detail: { token: null } }));
    navigate("/");
  };

  if (loading) {
    return (
      <div className="netflix-account-loading">
        <div className="account-spinner" />
        <span>Loading account details...</span>
      </div>
    );
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently Joined";

  const nextBillingDate = user?.validTill
    ? new Date(user.validTill).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Active (Lifetime Access)";

  return (
    <div className="netflix-account-page">
      <div className="netflix-account-container">

        <header className="account-header">
          <div className="account-header-left">
            <h1 className="account-title">Account</h1>
            <div className="account-member-since">
              <span className="since-text">Member Since {memberSince}</span>
            </div>
          </div>
          <div className="account-header-badge">
            {user?.isPremium ? (
              <span className="account-badge active">
                <Crown size={14} /> ACTIVE SUBSCRIBER
              </span>
            ) : (
              <span className="account-badge free">FREE READER</span>
            )}
          </div>
        </header>

        {toast && (
          <div className={`account-toast ${toast.type}`}>
            <span>{toast.msg}</span>
          </div>
        )}

        <section className="account-section">
          <div className="section-sidebar">
            <h2 className="section-label">MEMBERSHIP & BILLING</h2>
            {user?.isPremium ? (
              <button
                type="button"
                className="btn-netflix-secondary"
                onClick={() => setCancelModalOpen(true)}
              >
                Cancel Membership
              </button>
            ) : (
              <button
                type="button"
                className="btn-netflix-primary"
                onClick={() => {
                  setShowPlanSelector(true);
                  setTimeout(() => {
                    document.getElementById("plan-selection-anchor")?.scrollIntoView({ behavior: "smooth" });
                  }, 50);
                }}
              >
                Upgrade Plan
              </button>
            )}
          </div>

          <div className="section-content">

            <div className="account-row">
              <div className="account-row-details">
                <div className="primary-text">{user?.email || "No email on record"}</div>
                <div className="secondary-text">Password: ••••••••</div>
              </div>
              <div className="account-row-action">
                <button
                  type="button"
                  className="link-action"
                  onClick={() => navigate("/main/profile")}
                >
                  Edit profile
                </button>
              </div>
            </div>

            <div className="account-divider" />

            <div className="account-row">
              <div className="account-row-details">
                <div className="billing-method-pill">
                  <CreditCard size={15} />
                  <span>Razorpay Auto-Billing (UPI / Visa / MC)</span>
                </div>
                <div className="secondary-text">
                  {user?.isPremium ? (
                    <>Next billing cycle: <strong>{nextBillingDate}</strong></>
                  ) : (
                    "No active billing plan. Using standard free tier."
                  )}
                </div>
              </div>
              <div className="account-row-action">
                <span className="secure-badge">
                  <ShieldCheck size={14} /> PCI-DSS Verified
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="account-section">
          <div className="section-sidebar">
            <h2 className="section-label">PLAN DETAILS</h2>
          </div>

          <div className="section-content">
            <div className="account-row">
              <div className="account-row-details">
                <div className="plan-name-display">
                  <strong>{user?.isPremium ? `BookNest Unlimited (${user.plan || "Annual"})` : "Free Reader Tier"}</strong>
                  {user?.isPremium && <span className="quality-pill">PREMIUM CLOUD</span>}
                </div>
                <div className="secondary-text">
                  {user?.isPremium
                    ? "Full catalog access • Unlimited bookmarks • Instant cloud sync • AI reader assistant"
                    : "Standard catalog reading • Up to 50 bookmarks • Basic progress sync"}
                </div>
              </div>
              <div className="account-row-action">
                <button
                  type="button"
                  className="link-action"
                  onClick={() => setShowPlanSelector((prev) => !prev)}
                >
                  {showPlanSelector ? "Hide plans" : "Change plan"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {(showPlanSelector || !user?.isPremium) && (
          <section className="account-section plan-form-section" id="plan-selection-anchor">
            <div className="section-sidebar">
              <h2 className="section-label">CHOOSE PLAN</h2>
            </div>

            <div className="section-content">
              <div className="plan-selection-intro">
                <h3>Select the plan that fits your reading habits</h3>
                <p>Downgrade, pause, or cancel online anytime with no hidden charges.</p>
              </div>

              <div className="plan-selector-cards">
                <div
                  className={`plan-selector-box ${selectedPlan === "monthly" ? "selected" : ""}`}
                  onClick={() => setSelectedPlan("monthly")}
                >
                  <div className="plan-box-badge">MONTHLY</div>
                  <div className="plan-box-title">Monthly Reader</div>
                  <div className="plan-box-price">
                    <span className="curr">₹</span>
                    <span className="amount">99</span>
                    <span className="dur">/mo</span>
                  </div>
                  <div className="plan-box-sub">Billed monthly</div>
                </div>

                <div
                  className={`plan-selector-box ${selectedPlan === "yearly" ? "selected" : ""}`}
                  onClick={() => setSelectedPlan("yearly")}
                >
                  <div className="plan-box-badge popular">SAVE 58% • RECOMMENDED</div>
                  <div className="plan-box-title">Annual Reader</div>
                  <div className="plan-box-price">
                    <span className="curr">₹</span>
                    <span className="amount">499</span>
                    <span className="dur">/yr</span>
                  </div>
                  <div className="plan-box-sub">Just ₹41 / month (Billed yearly)</div>
                </div>
              </div>

              <table className="plan-matrix-table">
                <tbody>
                  <tr>
                    <td className="matrix-label">Price</td>
                    <td className={`matrix-val ${selectedPlan === "monthly" ? "active-col" : ""}`}>
                      ₹99 / month
                    </td>
                    <td className={`matrix-val ${selectedPlan === "yearly" ? "active-col" : ""}`}>
                      ₹499 / year
                    </td>
                  </tr>
                  <tr>
                    <td className="matrix-label">Gutenberg Catalog (60,000+ Books)</td>
                    <td className={`matrix-val ${selectedPlan === "monthly" ? "active-col" : ""}`}>
                      <Check size={16} className="text-netflix-blue" />
                    </td>
                    <td className={`matrix-val ${selectedPlan === "yearly" ? "active-col" : ""}`}>
                      <Check size={16} className="text-netflix-blue" />
                    </td>
                  </tr>
                  <tr>
                    <td className="matrix-label">Saved Bookmarks & Highlights</td>
                    <td className={`matrix-val ${selectedPlan === "monthly" ? "active-col" : ""}`}>
                      <strong>Unlimited</strong>
                    </td>
                    <td className={`matrix-val ${selectedPlan === "yearly" ? "active-col" : ""}`}>
                      <strong>Unlimited</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="matrix-label">Favorites Shelf</td>
                    <td className={`matrix-val ${selectedPlan === "monthly" ? "active-col" : ""}`}>
                      <strong>Unlimited</strong>
                    </td>
                    <td className={`matrix-val ${selectedPlan === "yearly" ? "active-col" : ""}`}>
                      <strong>Unlimited</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="matrix-label">AI Reading Assistant</td>
                    <td className={`matrix-val ${selectedPlan === "monthly" ? "active-col" : ""}`}>
                      Included
                    </td>
                    <td className={`matrix-val ${selectedPlan === "yearly" ? "active-col" : ""}`}>
                      Included
                    </td>
                  </tr>
                  <tr>
                    <td className="matrix-label">Multi-device Cloud Sync</td>
                    <td className={`matrix-val ${selectedPlan === "monthly" ? "active-col" : ""}`}>
                      Mobile, Tablet, Desktop
                    </td>
                    <td className={`matrix-val ${selectedPlan === "yearly" ? "active-col" : ""}`}>
                      Mobile, Tablet, Desktop
                    </td>
                  </tr>
                  <tr>
                    <td className="matrix-label">Ad-free Reading Environment</td>
                    <td className={`matrix-val ${selectedPlan === "monthly" ? "active-col" : ""}`}>
                      <Check size={16} className="text-netflix-blue" />
                    </td>
                    <td className={`matrix-val ${selectedPlan === "yearly" ? "active-col" : ""}`}>
                      <Check size={16} className="text-netflix-blue" />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="plan-checkout-footer">
                <p className="plan-legal-note">
                  HD and Ultra reading capabilities subject to internet service and device capabilities. Cancel anytime online.
                </p>
                <button
                  type="button"
                  className="btn-netflix-cta"
                  onClick={handleCheckout}
                >
                  Continue to Checkout ({selectedPlan === "yearly" ? "₹499/yr" : "₹99/mo"})
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="account-section">
          <div className="section-sidebar">
            <h2 className="section-label">SETTINGS</h2>
          </div>

          <div className="section-content">
            <div className="settings-links-list">
              <div
                className="settings-link-row"
                onClick={() => navigate("/main/library")}
              >
                <span>Manage Reading Library & Bookmarks</span>
                <ChevronRight size={17} />
              </div>

              <div
                className="settings-link-row"
                onClick={() => navigate("/main/my-books")}
              >
                <span>Self-Writing & Author Studio</span>
                <ChevronRight size={17} />
              </div>

              <div
                className="settings-link-row"
                onClick={() => navigate("/main/profile")}
              >
                <span>Edit Profile Information & Bio</span>
                <ChevronRight size={17} />
              </div>

              <div
                className="settings-link-row text-danger"
                onClick={handleLogout}
              >
                <span>Sign out of BookNest</span>
                <ChevronRight size={17} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {cancelModalOpen && (
        <div className="netflix-modal-overlay" onClick={() => setCancelModalOpen(false)}>
          <div className="netflix-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Cancel BookNest Membership?</h3>
            <p className="modal-copy">
              Cancellation is effective at the end of your current billing period (<strong>{nextBillingDate}</strong>). After this date, you will lose unlimited bookmarks, favorites, and AI reader privileges.
            </p>
            <div className="modal-button-row">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={handleCancelSubscription}
                disabled={cancelling}
              >
                {cancelling ? "Processing..." : "Finish Cancellation"}
              </button>
              <button
                type="button"
                className="btn-modal-keep"
                onClick={() => setCancelModalOpen(false)}
                disabled={cancelling}
              >
                Keep Membership
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
