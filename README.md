<div align="center">

# 🔍 Perplexity AI Clone

**A full-stack AI-powered search assistant built with the MERN stack**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mistral AI](https://img.shields.io/badge/Mistral_AI-LangChain-FF7000?style=for-the-badge)](https://mistral.ai/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

[🚀 Live Demo](https://perplexity-project-awlr.onrender.com) • [Report Bug](../../issues) • [Request Feature](../../issues)

</div>

---

## 📖 About The Project

A Perplexity AI-inspired search and chat assistant that combines real-time internet search with AI-generated responses. Users can ask any question and receive intelligent, sourced answers — just like Perplexity.ai. The app supports persistent chat history, full authentication with email verification, and real-time streaming via WebSockets.

### ✨ Key Features

- 🤖 **AI-Powered Answers** — Mistral AI (`mistral-medium-latest`) via LangChain generates intelligent, context-aware responses
- 🌐 **Real-Time Internet Search** — Tavily API searches the web and returns cited sources alongside answers
- 💬 **Persistent Chat History** — All conversations are saved per user and paginated for easy browsing
- 🔐 **JWT Authentication** — Secure login/register with HTTP-only cookies and 7-day sessions
- 📧 **Email Verification** — Nodemailer-powered verification flow on registration
- ⚡ **WebSocket Support** — Socket.IO for real-time communication
- 📱 **Responsive UI** — Clean, Perplexity-inspired interface built with Tailwind CSS v4
- 🧩 **Redux State Management** — Redux Toolkit manages auth and chat state across the app

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI Library |
| Vite | 7 | Build Tool |
| Tailwind CSS | v4 | Styling |
| Redux Toolkit | 2.x | State Management |
| React Router | v8 | Client-side Routing |
| Socket.IO Client | 4.x | Real-time Communication |
| Axios | 1.x | HTTP Requests |
| React Markdown | 10.x | Rendering AI Markdown Responses |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js + Express | 5.x | REST API Server |
| MongoDB + Mongoose | 9.x | Database & ODM |
| LangChain + Mistral AI | Latest | AI Agent & Response Generation |
| Tavily API | 0.7.x | Web Search |
| JSON Web Token | 9.x | Authentication |
| Socket.IO | 4.x | WebSocket Server |
| Nodemailer | 9.x | Email Verification |
| bcrypt | 6.x | Password Hashing |
| Zod | 4.x | Input Validation |

---

## 📁 Project Structure

```
perplexity-project/
├── Backend/
│   ├── server.js                  # Entry point
│   └── src/
│       ├── app.js                 # Express app setup
│       ├── config/
│       │   └── database.js        # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js # Register, login, logout, verify email
│       │   └── chat.controller.js # Send message, get chats, delete chat
│       ├── middleware/
│       │   └── auth.middleware.js # JWT verification
│       ├── models/
│       │   ├── user.model.js      # User schema
│       │   ├── chat.model.js      # Chat schema
│       │   └── message.model.js   # Message schema
│       ├── routes/
│       │   ├── auth.routes.js     # /api/auth/*
│       │   └── chat.routes.js     # /api/chats/*
│       ├── services/
│       │   ├── ai.service.js      # Mistral AI + LangGraph agent
│       │   ├── internet.service.js# Tavily search
│       │   └── mail.service.js    # Nodemailer
│       ├── sockets/
│       │   └── server.socket.js   # Socket.IO setup
│       └── validators/
│           └── auth.validator.js  # Zod + express-validator
│
└── Frontend/
    └── src/
        ├── app/
        │   ├── App.jsx            # Root component
        │   ├── app.routes.jsx     # Route definitions
        │   └── app.store.js       # Redux store
        └── features/
            ├── auth/              # Login, register, protected routes
            └── chat/              # Dashboard, chat UI, socket hooks
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB Atlas account (or local MongoDB)
- [Mistral AI API Key](https://console.mistral.ai/)
- [Tavily API Key](https://tavily.com/)
- Gmail account with App Password (for Nodemailer)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_jwt_key

MISTRAL_API_KEY=your_mistral_api_key
TAVILY_API_KEY=your_tavily_api_key

# Nodemailer (Gmail)
MAIL_USER=your_gmail@gmail.com
MAIL_PASS=your_gmail_app_password

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000

NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd Frontend
npm install
npm run dev
```

The frontend dev server will be running at `http://localhost:5173`, proxying API calls to the backend on port `8000`.

> **For production build:** Run `npm run build` inside `Frontend/`, then copy the `dist/` folder into `Backend/public/`. The Express server will serve it automatically.

---

## 🌐 Deployment

This project is deployed as a **single unified service on [Render](https://render.com/)**.

The React frontend is built with Vite and its static output (`dist/`) is served directly by the Express backend — no separate frontend hosting needed.

**Deployment steps:**
1. Run `npm run build` inside `Frontend/` and copy the `dist/` output to `Backend/public/`
2. Push to GitHub and connect your repo to Render
3. Set the start command to `node server.js` (inside the `Backend/` directory)
4. Add all environment variables in Render's dashboard (see `.env` reference above)

**Live URL:** [https://perplexity-project-awlr.onrender.com](https://perplexity-project-awlr.onrender.com)

> **Note:** On Render's free tier, the service may spin down after inactivity. The first request after idle can take ~30–60 seconds to respond.

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login and receive JWT cookie | ❌ |
| `POST` | `/logout` | Clear auth cookie | ✅ |
| `GET` | `/me` | Get current user details | ✅ |
| `GET` | `/verify-email?token=` | Verify email from link | ❌ |

### Chat Routes — `/api/chats`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/` | Send a message (creates chat if new) | ✅ |
| `GET` | `/` | Get all user chats (paginated) | ✅ |
| `GET` | `/:chatId/messages` | Get messages for a specific chat | ✅ |
| `DELETE` | `/:chatId` | Delete a chat and its messages | ✅ |

---

## 🔄 How It Works

```
User sends a question
        ↓
Backend receives via POST /api/chats
        ↓
If new chat → Mistral AI generates a title
        ↓
Message saved to MongoDB
        ↓
LangGraph ReAct Agent invoked:
  → Decides if internet search is needed
  → Calls Tavily API for real-time results
  → Mistral AI generates final answer with sources
        ↓
AI response + sources saved & returned to frontend
        ↓
React renders Markdown response with cited sources
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or pull requests.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 👤 Author

**Mohd Suzain Khan**

- 🌐 LinkedIn: [suzainkhan](https://www.linkedin.com/in/suzainkhan/)
- 🐙 GitHub: [@TheSuzainKhan](https://github.com/TheSuzainKhan)
- 📧 Email: its.suzainkhan@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ using the MERN Stack + Mistral AI
</div>
