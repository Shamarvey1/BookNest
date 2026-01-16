import React from "react";
import "./WritingEditor.css";

function WritingEditor({ value, onChange }) {
  return (
    <textarea
      className="writing-editor"
      placeholder="Start writing your story here..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default WritingEditor;

