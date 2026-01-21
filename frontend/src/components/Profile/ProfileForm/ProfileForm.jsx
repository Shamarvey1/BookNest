import React, { useState } from "react";
import "./ProfileForm.css";

function ProfileForm({ user, onSave, saving }) {
  const [name, setName] = useState(user.name || "");
  const [email] = useState(user.email || "");
  const [bio, setBio] = useState(user.bio || "");

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      name,
      bio,
      avatarUrl: user.avatarUrl
    });
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label>
        Email
        <input value={email} disabled />
      </label>

      <label>
        Bio
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </label>

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Done"}
      </button>
    </form>
  );
}

export default ProfileForm;
