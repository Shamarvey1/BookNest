import React, { useEffect, useState } from "react";
import "./Profile.css";
import AvatarUpload from "../../components/Profile/AvatarUpload/AvatarUpload.jsx";
import ProfileForm from "../../components/Profile/ProfileForm/ProfileForm.jsx";
import { getProfile, updateProfile } from "../../services/profileService";

function Profile() {
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setUser(data);
      } catch {
        setError("Failed to load profile");
      }
    }
    loadProfile();
  }, []);

  async function handleSave(updatedData) {
    try {
      setSaving(true);
      setError("");
      const updated = await updateProfile(updatedData);
      setUser(updated);
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2 className="profile-title">Edit Profile</h2>

        <AvatarUpload
          avatarUrl={user.avatarUrl}
          onChange={(url) => setUser({ ...user, avatarUrl: url })}
        />

        <ProfileForm user={user} onSave={handleSave} saving={saving} />

        {error && <p className="profile-error">{error}</p>}
      </div>
    </div>
  );
}

export default Profile;
