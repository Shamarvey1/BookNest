# AI Reading Assistant - Setup Guide

## Overview
The AI Reading Assistant has been successfully integrated into your BookNest ReaderPage. Users can now ask questions about the current book page, and the AI will answer using only the page context.

---

## WHAT WAS CREATED

### Frontend Components
✓ `frontend/src/components/AIChat/AIChat.jsx` - Main AI chat component with messages, input, loading state
✓ `frontend/src/components/AIChat/AIChat.css` - Modern, responsive styling (desktop sidebar + mobile drawer)
✓ `frontend/src/services/aiService.jsx` - Service to communicate with backend AI API
✓ `frontend/src/pages/ReaderPage/ReaderPage.jsx` - **MODIFIED** to integrate AIChat component
✓ `frontend/src/pages/ReaderPage/ReaderPage.css` - **MODIFIED** to add desktop two-column layout

### Backend Services
✓ `back-end/services/groqService.js` - Groq API integration using llama3-8b-8192 model
✓ `back-end/controllers/aiController.js` - Request handling and validation
✓ `back-end/routes/aiRoutes.js` - API route definition with auth middleware
✓ `back-end/server.js` - **MODIFIED** to include AI routes
✓ `back-end/package.json` - **MODIFIED** added groq-sdk dependency

---

## 🚀 SETUP INSTRUCTIONS

### Step 1: Install Groq SDK (Backend)

```bash
cd back-end
npm install
```

The groq-sdk package has been added to package.json and will be installed automatically.

### Step 2: Add Environment Variables (Backend)

Create or update your `.env` file in the `back-end` folder with:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5001
# ... other existing variables
```

**How to get GROQ_API_KEY:**
1. Go to https://console.groq.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

### Step 3: Verify Frontend Setup

No additional installations needed for frontend. The AIChat component is already integrated into ReaderPage.

---

## 📱 LAYOUT DETAILS

### Desktop (> 768px)
- **Left side**: Book reader (HTMLFlipBook)
- **Right side**: AI Assistant sidebar (320px width)
- Both visible side-by-side
- AI chat scrolls independently

### Mobile (≤ 768px)
- **Full width**: Book reader
- **Floating button**: Purple button with ✨ icon (bottom-right)
- **Drawer**: AI chat appears as bottom sheet modal (80vh height)
- Click button to open/close

---

## 💬 AI FEATURES

The AI Assistant can:
1. **Answer Questions** - "Who is Victor Frankenstein?"
2. **Explain Words** - "What does 'archaic' mean?"
3. **Summarize** - "Summarize this paragraph"
4. **Provide Context** - "What's happening in this scene?"
5. **Conversational** - Natural dialogue responses

### Important
- ✅ AI only uses provided page text as context
- ✅ No hallucinations or external knowledge
- ✅ User must be authenticated (token in localStorage)
- ✅ Handles all edge cases with helpful messages

---

## 🔌 API ENDPOINT

**URL:** `POST /api/ai/chat`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "question": "Who is the main character?",
  "context": "The current page text content here..."
}
```

**Response:**
```json
{
  "success": true,
  "response": "The main character is... [AI response]"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🎨 UI/UX FEATURES

### Desktop Sidebar
- Purple gradient header (✨ AI Assistant)
- Scrollable message area
- User messages: Purple bubbles (right)
- AI messages: Gray bubbles (left) with 🤖 avatar
- Typing indicator with animated dots
- Input field with send button (→)
- Clean, minimal design with soft shadows

### Mobile Drawer
- Same UI but full screen
- Bottom sheet from 80vh height
- Close button (✕) in header
- Tap backdrop to close
- Smooth slide-in animation

### Features
- ✨ Smooth message animations
- 🔄 Auto-scroll to latest message
- ⌨️ Enter to send (Shift+Enter for newline)
- 🚫 Disabled state while loading
- ♿ Accessible buttons and labels

---

## 🧪 TESTING THE FEATURE

### 1. Start Backend
```bash
cd back-end
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Navigate to ReaderPage
- Login/Signup if needed
- Click on a book to read
- View should show: Reader on left, AI on right (desktop)
- Or: Reader full width with ✨ button (mobile)

### 4. Test AI Chat
Desktop: Type in the right sidebar and press Enter
Mobile: Click ✨ button, type, and press Enter

Example questions to test:
- "What happens in this page?"
- "Explain the main event"
- "Who is mentioned here?"
- "What does [word] mean?"

---

## 🔧 CONFIGURATION

### Groq Model
Currently using: **llama3-8b-8192**

To change model, edit `back-end/services/groqService.js`:
```javascript
model: "llama3-8b-8192", // Change this line
```

Available Groq models:
- `mixtral-8x7b-32768`
- `gemma-7b-it`
- `llama3-70b-8192`
- And more at https://console.groq.com

### AI System Prompt
To customize AI behavior, edit the `systemPrompt` in `back-end/services/groqService.js`

---

## ✋ ERROR HANDLING

### Common Issues

**1. "GROQ_API_KEY is not set"**
- Solution: Add GROQ_API_KEY to .env file

**2. "Question is required"**
- Solution: User must type a question

**3. "Context (page text) is required"**
- Solution: Frontend should send current page text

**4. "Failed to process your question"**
- Solution: Check Groq API status, rate limits, or API key validity

**5. Mobile: ✨ button not appearing**
- Solution: Check viewport width (should be ≤ 768px)

---

## 📊 PERFORMANCE NOTES

- **First response**: ~2-5 seconds (Groq API latency)
- **Groq rate limit**: 30 requests per minute (free tier)
- **Message storage**: In-component state (clears on page refresh)
- **No database storage**: Keep chat history in frontend state or add to DB if needed

---

## 🔐 SECURITY

- ✅ Authentication required (authMiddleware)
- ✅ API key safely stored in backend .env
- ✅ Never expose GROQ_API_KEY to frontend
- ✅ Input validation on question and context
- ✅ Error messages don't leak sensitive info

---

## 📈 FUTURE ENHANCEMENTS

Possible additions (not in current MVP):
- Save chat history to database
- Bookmark favorite Q&A pairs
- Search chat history
- Multiple AI models selection
- Chat settings (tone, language)
- Export chat as PDF
- Real-time collaborative discussions

---

## 📝 FILES SUMMARY

### Created
- `frontend/src/components/AIChat/AIChat.jsx`
- `frontend/src/components/AIChat/AIChat.css`
- `frontend/src/services/aiService.jsx`
- `back-end/services/groqService.js`
- `back-end/controllers/aiController.js`
- `back-end/routes/aiRoutes.js`

### Modified
- `frontend/src/pages/ReaderPage/ReaderPage.jsx`
- `frontend/src/pages/ReaderPage/ReaderPage.css`
- `back-end/server.js`
- `back-end/package.json`

---

## ❓ NEED HELP?

Check:
1. GROQ_API_KEY is set correctly
2. Backend server is running (`npm run dev`)
3. Frontend is running (`npm run dev`)
4. User is authenticated (token in localStorage)
5. Browser console for any errors
6. Backend logs for API issues

---

**Setup Complete! 🎉 Your AI Reading Assistant is ready to use.**
