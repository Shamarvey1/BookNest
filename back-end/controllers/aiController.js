const { getAIResponse, getAIWritingAssistance } = require("../utils/groqService");

const chatWithAI = async (req, res) => {
  try {
    const { question, context, bookTitle, bookAuthors, history } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    if (!context || !context.trim()) {
      return res.status(400).json({
        success: false,
        message: "Context (page text) is required",
      });
    }

    const response = await getAIResponse(question.trim(), context.trim(), {
      bookTitle,
      bookAuthors,
      history: Array.isArray(history) ? history : [],
    });

    res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("AI Chat Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to process your question",
    });
  }
};

const assistWriting = async (req, res) => {
  try {
    const { action, text, title, genre } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        message: "Writing action is required (continue, polish, describe, or brainstorm)",
      });
    }

    const suggestion = await getAIWritingAssistance({
      action,
      text: text || "",
      title: title || "Untitled Book",
      genre: genre || "Fiction",
    });

    res.status(200).json({
      success: true,
      suggestion,
    });
  } catch (error) {
    console.error("AI Writing Assist Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate writing assistance",
    });
  }
};

module.exports = {
  chatWithAI,
  assistWriting,
};
