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

const getAIWritingAssistance = async ({ action = "continue", text = "", title = "Untitled", genre = "Fiction" }) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in backend configuration.");
  }

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  let systemPrompt = "";
  let userPrompt = "";

  if (action === "continue") {
    systemPrompt = `You are a world-class creative writing co-author. The author is writing a book titled "${title}" in the genre "${genre}".
Your task: Continue the story seamlessly from the provided text. Match the author's writing style, perspective (1st/3rd person), dialogue cadence, and tone.
Produce 1 to 3 engaging paragraphs that advance the scene naturally. Do not write filler. Output ONLY the story continuation without meta-commentary.`;
    userPrompt = `[Current Story Snippet]:\n"""\n${text.slice(-3000)}\n"""\n\nPlease continue the next paragraph naturally:`;
  } else if (action === "polish") {
    systemPrompt = `You are an expert literary editor. The author is writing a book titled "${title}" in the genre "${genre}".
Your task: Polish and elevate the provided draft text. Enhance sensory descriptions, vocabulary, rhythm, and fix any grammar/flow issues while strictly respecting the author's voice and intent.
Output ONLY the polished replacement text without conversational preamble or quotes.`;
    userPrompt = `[Draft Text to Polish]:\n"""\n${text}\n"""`;
  } else if (action === "describe") {
    systemPrompt = `You are a master book marketing editor. The book is titled "${title}" in the genre "${genre}".
Your task: Write an irresistible, captivating book blurb / synopsis (approx. 70-120 words) suitable for the back cover or digital store. Include a hook, the core conflict, and high stakes without spoiling the ending.
Output ONLY the blurb.`;
    userPrompt = `[Story Context / Excerpt]:\n"""\n${text.slice(0, 3000)}\n"""`;
  } else if (action === "brainstorm") {
    systemPrompt = `You are a veteran creative writing consultant and novelist. The book is titled "${title}" in the genre "${genre}".
Your task: Propose 3 compelling, unexpected, and genre-appropriate plot twists, character revelations, or scene developments that could happen next.
Format as:
1. **[Idea Title]**: [Brief description]
2. **[Idea Title]**: [Brief description]
3. **[Idea Title]**: [Brief description]`;
    userPrompt = `[Story So Far]:\n"""\n${text.slice(-3000)}\n"""\n\nGive me 3 creative plot twists / scene directions:`;
  } else {
    throw new Error(`Unknown writing action: ${action}`);
  }

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt }
  ];

  for (const model of CANDIDATE_MODELS) {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages,
        temperature: action === "polish" ? 0.3 : 0.7,
        max_tokens: 1000,
      });

      const reply = completion.choices?.[0]?.message?.content?.trim();
      if (reply) {
        return reply;
      }
    } catch (err) {
      console.warn(`Writing assist model ${model} failed: ${err.message}. Trying next candidate...`);
    }
  }

  throw new Error("Failed to generate writing assistance. Please try again in a moment.");
};

module.exports = {
  getAIResponse,
  getAIWritingAssistance,
};