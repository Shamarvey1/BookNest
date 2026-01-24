import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./WriteBook.css";

import {createBook,fetchBookById,updateBook} from "../../../services/writingService";

import WritingEditor from "../../../components/Writing/WritingEditor/WritingEditor";
import WritingTips from "../../../components/Writing/WritingTips/WritingTips";
import WritingSteps from "../../../components/Writing/WritingSteps/WritingSteps";
import BookNestLoader from "../../../components/Loader/BookNestLoader/BookNestLoader";

function WriteBook() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [step, setStep] = useState("details");

  const [title, setTitle] = useState("Untitled Book");
  const [genre, setGenre] = useState("Fiction");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    async function loadBook() {
      try {
        const book = await fetchBookById(id);
        setTitle(book.title || "Untitled Book");
        setGenre(book.genre || "Fiction");
        setDescription(book.description || "");
        setCoverUrl(book.coverUrl || "");
        setContent(book.content || "");
      } catch {
        setError("Failed to load book");
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id, isEdit]);

  async function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "demo_unsigned");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dotbkqkxc/image/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error("Upload failed");
      }
      console.log("Image URL:", data.secure_url);
      setCoverUrl(data.secure_url);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setError("Image upload failed. Check Cloudinary settings.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Book title is required");
      return;
    }

    if (uploading) {
      setError("Please wait for image upload to finish");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        title,
        genre,
        description,
        coverUrl,
        content
      };

      if (isEdit) {
        await updateBook(id, payload);
      } else {
        await createBook(payload);
      }

      navigate("/main/my-books");
    } catch (err) {
      setError(err.message || "Failed to save book");
    } finally {
      setSaving(false);
    }
  }



    if (loading) {
      return <BookNestLoader text="Loading your book..." />;
    }
    
  return (
    <div className="write-book-page">
      <div className="write-book-header">
        <div>
          <h1>{isEdit ? "Edit Book" : "Write New Book"}</h1>
          <p>Create and manage your writing</p>
        </div>

        <div className="write-book-actions">
          <button
            className="cancel-btn"
            onClick={() => navigate("/main/my-books")}
          >
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving || uploading}
          >
            {uploading
              ? "Uploading image..."
              : saving
              ? "Saving..."
              : "Save Book"}
          </button>
        </div>
      </div>

      <WritingSteps currentStep={step} onChange={setStep} />

      {error && <p className="write-book-error">{error}</p>}

      <div className="write-card">
        {step === "details" && (
          <div className="details-form">
            <label>
              Title *
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label>
              Genre
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option>Fiction</option>
                <option>Non-fiction</option>
                <option>Poetry</option>
                <option>Biography</option>
              </select>
            </label>

            <label className="cover-upload">
              Cover Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleCoverUpload}
              />

              <div className="cover-preview">
                {coverUrl ? (
                  <img src={coverUrl} alt="Cover preview" />
                ) : (
                  <span>
                    {uploading ? "Uploading..." : "Click to add photo"}
                  </span>
                )}
              </div>
            </label>

            <label>
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </div>
        )}

        {step === "content" && (
          <>
            <WritingEditor value={content} onChange={setContent} />
            <WritingTips />
          </>
        )}
      </div>
    </div>
  );
}

export default WriteBook;
