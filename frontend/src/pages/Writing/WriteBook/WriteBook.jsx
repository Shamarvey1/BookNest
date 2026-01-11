import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./WriteBook.css";

import {
  createBook,
  fetchBookById,
  updateBook,
} from "../../../services/writingService";

import WritingEditor from "../../../components/Writing/WritingEditor/WritingEditor";
import WritingSteps from "../../../components/Writing/WritingSteps/WritingSteps";
import WritingTips from "../../../components/Writing/WritingTips/WritingTips";
import WritingSkeleton from "../../../components/Writing/WritingSkeleton/WritingSkeleton";

function WriteBook() {
  const navigate = useNavigate();
  const { id } = useParams(); 

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!isEditMode) return;

    async function loadBook() {
      try {
        const book = await fetchBookById(id);
        setTitle(book.title);
        setContent(book.content);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id, isEditMode]);

  function handleCancel() {
    navigate("/main/my-books");
  }

  async function handleSave() {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
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

  if (loading) {
    return <WritingSkeleton />;
  }

  return (
    <div className="write-book-page">

      <div className="write-book-header">
        <div>
          <h1 className="write-book-title">
            {isEditMode ? "Edit Book" : "Write New Book"}
          </h1>
          <p className="write-book-subtitle">
            {isEditMode
              ? "Continue writing your book"
              : "Create your masterpiece"}
          </p>
        </div>

        <div className="write-book-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>

          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Book"}
          </button>
        </div>
      </div>

    
      <WritingSteps />


      {error && <p className="error-text">{error}</p>}


      <div className="write-book-content">
        <div className="editor-section">
          <input
            type="text"
            className="book-title-input"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <WritingEditor
            value={content}
            onChange={setContent}
          />
        </div>

        <div className="tips-section">
          <WritingTips />
        </div>
      </div>
    </div>
  );
}

export default WriteBook;
