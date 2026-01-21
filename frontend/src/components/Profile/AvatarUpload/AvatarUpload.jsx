import React, { useRef, useState } from "react";
import "./AvatarUpload.css";

function AvatarUpload({ avatarUrl, onChange }) {
  const fileRef = useRef();
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "demo_unsigned");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dotbkqkxc/image/upload",
      { method: "POST", body: formData }
    );

    const data = await res.json();
    onChange(data.secure_url);
    setUploading(false);
  }

  return (
    <div className="avatar-upload">
      <div
        className="avatar-circle"
        onClick={() => fileRef.current.click()}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" />
        ) : (
          <span>+</span>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/*"
        onChange={handleFile}
      />

      <p className="avatar-text">
        {uploading ? "Uploading..." : "Change profile photo"}
      </p>
    </div>
  );
}

export default AvatarUpload;
