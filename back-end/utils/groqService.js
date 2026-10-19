const OpenAI = require("openai");

const CANDIDATE_MODELS = [
  process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
];

const getAIResponse = async (question, context, bookInfo = {}) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in backend configuration.");
  }

  if (!question?.trim() || !context?.trim()) {
    throw new Error("Question and context are required.");
  }

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const bookTitle = bookInfo.bookTitle || "this book";
  const bookAuthors = Array.isArray(bookInfo.bookAuthors)
    ? bookInfo.bookAuthors.join(", ")
    : bookInfo.bookAuthors || "the author";

  const systemPrompt = `You are an AI Reading Assistant for the book "${bookTitle}" by ${bookAuthors}.

Your job is to assist the reader with whatever they ask about the active page spread and this book.

GUIDELINES:
1. ACTIVE SPREAD CONTEXT:
   - Ground your answer in the reader's current page text below when discussing what is happening, who is speaking, or analyzing dialogues, actions, and period words.
2. BOOK CONTEXT & HELPFULNESS:
   - If the user asks about character backgrounds, overarching plot, or historical context, answer informatively and clearly.
   - Avoid spoilers for future chapters unless explicitly requested.
3. CONCISE & READABLE:
   - Provide clear, well-structured, easy-to-read answers.`;


  const messages = [{ role: "system", content: systemPrompt }];

  if (Array.isArray(bookInfo.history) && bookInfo.history.length > 0) {
    for (const item of bookInfo.history.slice(-6)) {
      if (item && item.content && (item.role === "user" || item.role === "assistant")) {
        messages.push({
          role: item.role,
          content: item.content.trim(),
        });
      }
    }
  }

  messages.push({
    role: "user",
    content: `[Current Reading Context (Active Pages)]:\n"""\n${context}\n"""\n\nReader's Question: ${question}`,
  });

  const candidateModels = CANDIDATE_MODELS;
  let lastError = null;

  for (const model of candidateModels) {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 800,
      });

      const reply = completion.choices?.[0]?.message?.content?.trim();
      if (reply) {
        return reply;
      }
    } catch (err) {
      console.warn(`Groq model ${model} failed: ${err.message}. Trying next candidate...`);
      lastError = err;
    }
  }

  throw new Error(lastError?.message || "Failed to generate AI response");
};

module.exports = {
  getAIResponse,
};