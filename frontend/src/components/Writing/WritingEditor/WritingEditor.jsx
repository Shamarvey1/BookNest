import React from "react";
import "./WritingEditor.css";

function WritingEditor({ value, onChange }) {
  const wordCount = value.trim()
    ? value.trim().split(/\s+/).length
    : 0;

  return (
    <div className="writing-editor">
      <textarea
        placeholder="Start writing your book here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="word-count">{wordCount} words</div>
    </div>
  );
}

export default WritingEditor;
