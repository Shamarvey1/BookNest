const { getAIResponse } = require("../utils/groqService");

const chatWithAI = async (req, res) => {
  try {
    const { question, context, bookTitle, bookAuthors } = req.body;

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

module.exports = {
  chatWithAI,
};
