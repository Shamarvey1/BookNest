import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./WriteBook.css";

import {
  createBook,
  fetchBookById,
  updateBook,
} from "../../../services/writingService";

import WritingEditor from "../../../components/Writing/WritingEditor/WritingEditor";
import WritingTips from "../../../components/Writing/WritingTips/WritingTips";

function WriteBook() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  // step: "details" | "content"
  const [step, setStep] = useState("details");

  const [title, setTitle] = useState("Untitled Book");
  const [genre, setGenre] = useState("Fiction");
  const [coverUrl, setCoverUrl] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // load existing book
  useEffect(() => {
    if (!isEditMode) return;

    async function loadBook() {
      try {
        const book = await fetchBookById(id);
        setTitle(book.title || "Untitled Book");
        setContent(book.content || "");
      } catch (err) {
        setError(err.message);
      }
    }

    loadBook();
  }, [id, isEditMode]);

  const wordCount = content.trim()
    ? content.trim().split(/\s+/).length
    : 0;

  async function handleSave() {
    if (!title.trim()) {
      setError("Book title is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isEditMode) {
        await updateBook(id, { title, content });
      } else {
        await createBook({ title, content });
      }

      navigate("/main/my-books");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="write-book-page">
      {/* Header */}
      <div className="write-book-header">
        <div>
          <h1>Write New Book</h1>
          <p>Create your masterpiece</p>
        </div>

        <div className="write-book-actions">
          <button className="cancel-btn" onClick={() => navigate("/main/my-books")}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            Save Book
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="write-steps">
        <button
          className={step === "details" ? "step active" : "step"}
          onClick={() => setStep("details")}
        >
          Book Details
        </button>
        <button
          className={step === "content" ? "step active" : "step"}
          onClick={() => setStep("content")}
        >
          Write Content
        </button>
      </div>

      {/* Error */}
      {error && <p className="error-text">{error}</p>}

      {/* Step Content */}
      <div className="write-card">
        {step === "details" && (
          <div className="details-form">
            <label>
              Book Title *
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label>
              Genre
              <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                <option>Fiction</option>
                <option>Non-fiction</option>
                <option>Poetry</option>
                <option>Biography</option>
              </select>
            </label>

            <label>
              Cover Image URL
              <input
                placeholder="https://example.com/cover.jpg"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
              />
            </label>

            <label>
              Description
              <textarea
                placeholder="Write a brief description of your book..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
          </div>
        )}

        {step === "content" && (
          <>
            <div className="content-header">
              <span>Book Content</span>
              <span>{wordCount} words</span>
            </div>

            <WritingEditor value={content} onChange={setContent} />
            <WritingTips />
          </>
        )}
      </div>
    </div>
  );
}

export default WriteBook;
