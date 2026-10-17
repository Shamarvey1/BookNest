import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Camera,
  Check,
  AlertCircle,
  ChevronRight,
  Plus,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { getProfile, updateProfile } from "../../services/profileService";
import { fetchMyBooks } from "../../services/writingService";
import { useBookmarks } from "../../context/BookmarkContext";
import { useFavorites } from "../../context/FavoriteContext";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { bookmarks } = useBookmarks();
  const { favorites } = useFavorites();

  const [user, setUser] = useState(null);
  const [authoredBooks, setAuthoredBooks] = useState([]);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [toast, setToast] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [profileData, myBooksData] = await Promise.all([
          getProfile(),
          fetchMyBooks().catch(() => []),
        ]);
        setUser(profileData);
        setName(profileData?.name || "");
        setBio(profileData?.bio || "");
        setAvatarUrl(profileData?.avatarUrl || "");
        setAuthoredBooks(myBooksData || []);
      } catch (err) {
        showToast("error", "Failed to load profile data");
      }
    }
    loadData();
  }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "demo_unsigned");

      const res = await fetch("https://api.cloudinary.com/v1_1/dotbkqkxc/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setAvatarUrl(data.secure_url);
        const updated = await updateProfile({
          name: name || user?.name,
          bio,
          avatarUrl: data.secure_url,
        });
        setUser(updated);
        window.dispatchEvent(new CustomEvent("userProfileUpdated", { detail: updated }));
        showToast("success", "Profile picture updated successfully");
      }
    } catch (err) {
      showToast("error", "Failed to upload photo. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updated = await updateProfile({
        name,
        bio,
        avatarUrl,
      });
      setUser(updated);
      window.dispatchEvent(new CustomEvent("userProfileUpdated", { detail: updated }));
      showToast("success", "Profile changes saved");
    } catch (err) {
      showToast("error", err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="netflix-profile-loading">
        <div className="profile-spin" />
        <span>Loading profile...</span>
      </div>
    );
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recent Member";

  const initials = user?.name ? user.name[0].toUpperCase() : "U";

  return (
    <div className="netflix-profile-page">
      <div className="netflix-profile-container">

        <header className="profile-header">
          <div className="profile-header-meta">
            <h1 className="profile-title">Profile & Preferences</h1>
            <p className="profile-subtitle">
              Manage your reader identity, account details, and public profile.
            </p>
          </div>
          <div className="profile-status-pill">
            {user?.isPremium ? (
              <span className="badge-sub active">UNLIMITED SUBSCRIBER</span>
            ) : (
              <span className="badge-sub free">FREE READER</span>
            )}
          </div>
        </header>

        {toast && (
          <div className={`profile-toast ${toast.type}`}>
            {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{toast.msg}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile}>

          <section className="profile-section">
            <div className="section-col-label">
              <span className="col-title">PROFILE IDENTITY</span>
            </div>

            <div className="section-col-content">
              <div className="avatar-identity-row">
                <div
                  className="netflix-avatar-box"
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to change profile picture"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={user?.name} className="avatar-img-square" />
                  ) : (
                    <div className="avatar-initials-square">{initials}</div>
                  )}

                  <div className="avatar-hover-overlay">
                    <Camera size={20} />
                    <span>Change</span>
                  </div>

                  {uploadingAvatar && (
                    <div className="avatar-loading-overlay">
                      <div className="avatar-spin" />
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarFile}
                />

                <div className="identity-fields">
                  <div className="field-group">
                    <label className="field-label" htmlFor="name-input">
                      Display Name
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      className="netflix-text-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Account Email</label>
                    <div className="readonly-row">
                      <span className="email-val">{user?.email}</span>
                      <span className="verified-tag">
                        <ShieldCheck size={13} /> Verified
                      </span>
                    </div>
                    <span className="field-hint">Primary email associated with your BookNest account.</span>
                  </div>
                </div>
              </div>

              <div className="field-group bio-group">
                <label className="field-label" htmlFor="bio-input">
                  About You (Bio)
                </label>
                <textarea
                  id="bio-input"
                  className="netflix-textarea"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell fellow readers about your reading tastes, favorite authors, or writing projects..."
                  maxLength={300}
                />
                <span className="char-indicator">{bio.length}/300 characters</span>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="section-col-label">
              <span className="col-title">ACTIVITY & LIBRARY</span>
            </div>

            <div className="section-col-content">
              <div className="metrics-list">
                <div
                  className="metric-row-clickable"
                  onClick={() => navigate("/main/library")}
                >
                  <div className="metric-info">
                    <span className="metric-label">Saved Bookmarks</span>
                    <span className="metric-sub">Books bookmarked in your personal library</span>
                  </div>
                  <div className="metric-action">
                    <strong className="metric-number">{bookmarks.length}</strong>
                    <ChevronRight size={16} />
                  </div>
                </div>

                <div
                  className="metric-row-clickable"
                  onClick={() => navigate("/main/library")}
                >
                  <div className="metric-info">
                    <span className="metric-label">Favorites Shelf</span>
                    <span className="metric-sub">Curated list of your top favorite titles</span>
                  </div>
                  <div className="metric-action">
                    <strong className="metric-number">{favorites.length}</strong>
                    <ChevronRight size={16} />
                  </div>
                </div>

                <div
                  className="metric-row-clickable"
                  onClick={() => navigate("/main/my-books")}
                >
                  <div className="metric-info">
                    <span className="metric-label">Authored Stories</span>
                    <span className="metric-sub">Original books created in BookNest Author Studio</span>
                  </div>
                  <div className="metric-action">
                    <strong className="metric-number">{authoredBooks.length}</strong>
                    <ChevronRight size={16} />
                  </div>
                </div>

                <div className="metric-row-static">
                  <div className="metric-info">
                    <span className="metric-label">Member Since</span>
                    <span className="metric-sub">Active community reader</span>
                  </div>
                  <div className="metric-action">
                    <span className="metric-date">{memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="section-col-label">
              <span className="col-title">MEMBERSHIP</span>
            </div>

            <div className="section-col-content">
              <div className="plan-summary-row">
                <div className="plan-summary-copy">
                  <div className="plan-tier-heading">
                    <strong>{user?.isPremium ? `BookNest Unlimited (${user.plan || "Annual"})` : "Free Reader Tier"}</strong>
                    <span className={`status-pill ${user?.isPremium ? "active" : "free"}`}>
                      {user?.isPremium ? "Active" : "Standard"}
                    </span>
                  </div>
                  <p className="plan-summary-desc">
                    {user?.isPremium
                      ? "Unlimited bookmarks, favorites, AI summaries, and multi-device cloud synchronization."
                      : "Upgrade to Unlimited for unrestricted bookmarks, AI summaries, and priority cloud sync."}
                  </p>
                </div>
                <div className="plan-summary-btn-wrap">
                  <button
                    type="button"
                    className="btn-netflix-secondary"
                    onClick={() => navigate("/main/premium")}
                  >
                    Manage Membership
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="section-col-label">
              <span className="col-title">AUTHOR STUDIO</span>
            </div>

            <div className="section-col-content">
              <div className="author-studio-header">
                <span className="author-copy">Your published and draft books:</span>
                <button
                  type="button"
                  className="btn-create-inline"
                  onClick={() => navigate("/main/write-book")}
                >
                  <Plus size={15} />
                  <span>Write New Book</span>
                </button>
              </div>

              {authoredBooks.length === 0 ? (
                <div className="author-empty-note">
                  <BookOpen size={20} className="empty-icon" />
                  <p>You haven't authored any original stories yet. Start writing your own book now.</p>
                </div>
              ) : (
                <div className="authored-clean-list">
                  {authoredBooks.slice(0, 3).map((book) => (
                    <div
                      key={book.id}
                      className="authored-clean-item"
                      onClick={() => navigate(`/main/write-book/${book.id}`)}
                    >
                      <div className="item-title-wrap">
                        <strong>{book.title}</strong>
                        <span className="item-genre">{book.genre || "Original Story"}</span>
                      </div>
                      <ChevronRight size={16} />
                    </div>
                  ))}
                  {authoredBooks.length > 3 && (
                    <button
                      type="button"
                      className="link-view-all"
                      onClick={() => navigate("/main/my-books")}
                    >
                      View all {authoredBooks.length} stories →
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>

          <div className="profile-form-footer">
            <button
              type="submit"
              className="btn-netflix-primary btn-save"
              disabled={saving}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn-netflix-secondary"
              onClick={() => navigate("/main")}
            >
              Back to Browse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;

