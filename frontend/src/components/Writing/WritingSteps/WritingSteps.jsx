import React from "react";
import "./WritingSteps.css";

function WritingSteps({ currentStep, onChange }) {
  return (
    <div className="writing-steps">
      <button
        className={`writing-step ${
          currentStep === "details" ? "active" : ""
        }`}
        onClick={() => onChange("details")}
      >
        Book Details
      </button>

      <button
        className={`writing-step ${
          currentStep === "content" ? "active" : ""
        }`}
        onClick={() => onChange("content")}
      >
        Write Content
      </button>
    </div>
  );
}

export default WritingSteps;
