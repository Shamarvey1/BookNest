import React, { useState, useRef, useEffect } from "react";
import "./WritingEditor.css";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  List,
  Minus,
  Maximize2,
  Minimize2,
} from "lucide-react";

function WritingEditor({ value = "", onChange }) {
  const [isZenMode, setIsZenMode] = useState(false);
  const textareaRef = useRef(null);

  const trimmed = value.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const chars = value.length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isZenMode) {
        setIsZenMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZenMode]);

  const insertFormatting = (prefix, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);

    let replacement = "";
    if (suffix) {
      replacement = `${prefix}${selected || "text"}${suffix}`;
    } else {
      replacement = `\n${prefix}${selected || ""}`;
    }

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 50);
  };

  return (
    <div className={`writing-editor-container ${isZenMode ? "zen-mode-active" : ""}`}>
      <div className="editor-top-toolbar">
        <div className="toolbar-group formatting-tools">
          <button
            type="button"
            className="tool-btn"
            title="Bold"
            onClick={() => insertFormatting("**", "**")}
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Italic"
            onClick={() => insertFormatting("*", "*")}
          >
            <Italic size={15} />
          </button>
          <span className="toolbar-divider" />
          <button
            type="button"
            className="tool-btn"
            title="Heading 1"
            onClick={() => insertFormatting("# ")}
          >
            <Heading1 size={15} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Heading 2"
            onClick={() => insertFormatting("## ")}
          >
            <Heading2 size={15} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Quote"
            onClick={() => insertFormatting("> ")}
          >
            <Quote size={15} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Bullet list"
            onClick={() => insertFormatting("- ")}
          >
            <List size={15} />
          </button>
          <button
            type="button"
            className="tool-btn"
            title="Section Break"
            onClick={() => insertFormatting("\n---\n")}
          >
            <Minus size={15} />
          </button>
        </div>

        <div className="toolbar-group right-tools">
          <button
            type="button"
            className={`tool-btn zen-btn ${isZenMode ? "active" : ""}`}
            title={isZenMode ? "Exit Zen Mode (Esc)" : "Distraction-Free Focus Mode"}
            onClick={() => setIsZenMode(!isZenMode)}
          >
            {isZenMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            <span className="zen-label">{isZenMode ? "Exit Focus" : "Focus Mode"}</span>
          </button>
        </div>
      </div>

      <div className="textarea-wrapper">
        <textarea
          ref={textareaRef}
          className="writing-editor"
          placeholder="Once upon a time... Start writing your manuscript here."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck="true"
        />
      </div>

      <div className="editor-bottom-bar">
        <div className="stats-items">
          <span className="stat-pill">
            <strong>{words.toLocaleString()}</strong> words
          </span>
          <span className="stat-pill">
            <strong>{chars.toLocaleString()}</strong> characters
          </span>
          <span className="stat-pill">
            <strong>~{readingTime}</strong> min read
          </span>
        </div>
        <div className="draft-status">
          <span className="draft-dot" />
          <span>Draft saved</span>
        </div>
      </div>
    </div>
  );
}

export default WritingEditor;
