const OpenAI = require("openai");

const getAIResponse = async (question, context, bookInfo = {}) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  if (!question?.trim() || !context?.trim()) {
    throw new Error("Question and context are required");
  }

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
  const bookTitle = bookInfo.bookTitle || "Unknown title";
  const bookAuthors = Array.isArray(bookInfo.bookAuthors)
    ? bookInfo.bookAuthors.join(", ")
    : bookInfo.bookAuthors || "Unknown author";
  const prompt = `You are an AI Reading Assistant.
Use only the provided context to answer.
If the question asks the meaning of a word and that word appears in context as a name/family/place, explain it from context.
If the answer is not in context, say that clearly.
If the user asks for the author, title, or book name, answer using the book metadata below.

Book title: ${bookTitle}
Book authors: ${bookAuthors}

Context:
${context}

Question:
${question}`;

  const response = await client.responses.create({
    model,
    input: prompt,
    max_output_tokens: 400,
  });

  const aiText = response?.output_text?.trim();

  if (!aiText) {
    throw new Error("Empty response from AI");
  }

  const meaningMatch = question.match(/what does\s+['"]?([a-z][a-z'-]{1,})['"]?\s+mean|['"]?([a-z][a-z'-]{1,})['"]?\s+means?/i);
  const meaningWord = (meaningMatch?.[1] || meaningMatch?.[2] || "").toLowerCase();
  const contextLower = context.toLowerCase();
  const wordInContext =
    meaningWord &&
    (contextLower.includes(meaningWord) || contextLower.includes(`${meaningWord}s`) || contextLower.includes(`${meaningWord}'s`));
  const refusal = /not in context|not included|does not explain|doesn't explain|cannot answer|can't answer/i.test(aiText);

  if (meaningWord && wordInContext && refusal) {
    return `In this page, "${meaningWord}" is used as a proper noun (name/family/place) in the story context.`;
  }

  return aiText;
};

module.exports = {
  getAIResponse,
};