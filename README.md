# 🗳️ VotingApp — Digital Democratic Voting Platform

A secure, full-stack voting platform built for the modern web. Voters register using their Aadhar Card Number, cast a single authenticated vote, and view live election results in real time. Admins manage candidates through a dedicated panel.

> Built with Node.js · Express.js · MongoDB · React.js

---
## ✨ Features

**Voter**
- Secure registration and login via Aadhar Card Number
- Cast one vote per voter — strictly enforced
- View live election results with vote percentage bars
- View and edit personal profile information
- Change password securely
- Auto logout after 2 minutes of inactivity

**Admin**
- Add, edit, and delete candidates
- View real-time vote counts and standings
- Admin role is restricted — only one admin per system
- Admin cannot vote (enforced on both frontend and backend)

**Security**
- Passwords hashed with bcrypt — never stored as plain text
- JWT-based stateless authentication
- Rate limiting on all routes (100 req / 15 min per IP)
- Stricter rate limiting on auth routes (10 attempts / 15 min)
- Request body size capped at 10kb
- NoSQL injection prevention via express-mongo-sanitize
- HTTP Parameter Pollution protection via hpp
- Security headers via helmet
- Voter records are permanent — no self-deletion (government system design)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router DOM v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcrypt |
| Styling | Custom CSS — no UI library |

---

## 📁 Project Structure

```
Voting-App/
│
├── backend/
│   ├── models/
│   │   ├── user.js               # Voter/Admin schema
│   │   └── candidate.js          # Candidate schema
│   ├── routes/
│   │   ├── userRoutes.js         # Auth + profile endpoints
│   │   └── candidateRoutes.js    # Candidate + voting endpoints
│   ├── db.js                     # MongoDB connection
│   ├── jwt.js                    # JWT middleware + token helper
│   ├── server.js                 # Express app + security middleware
│   ├── .env                      # Environment variables (not committed)
│   ├── .env.example              # Template for required env vars
│   └── package.json
│
└── frontend/
    └── src/
        ├── api/
        │   └── api.js            # Centralized API fetch helper
        ├── context/
        │   └── AuthContext.jsx   # Global authentication state
        ├── components/
        │   ├── Navbar.jsx        # Navigation bar
        │   └── ProtectedRoute.jsx# Auth route guard
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── AuthPage.jsx      # Login + Signup
        │   ├── VotePage.jsx
        │   ├── ResultsPage.jsx
        │   ├── ProfilePage.jsx
        │   └── AdminPage.jsx
        ├── styles/
        │   └── global.css
        ├── useAutoLogout.js      # Inactivity detection hook
        ├── App.js                # Route definitions
        └── index.js
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or above
- [MongoDB](https://www.mongodb.com/) local or Atlas
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Voting-App.git
cd Voting-App
```

---

### 2. Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your own values. See `.env.example` for all required keys.

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

---

### 3. Run Backend

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
listening on port 3000
Connected to MongoDB server
```

---

### 4. Run Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

Opens at: `http://localhost:3001`

---

## 🔗 API Reference

### User Routes — `/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/user/signup` | Public | Register new voter or admin |
| POST | `/user/login` | Public | Login and receive JWT token |
| GET | `/user/profile` | 🔒 JWT | Get logged-in user profile |
| PUT | `/user/profile` | 🔒 JWT | Update profile information |
| PUT | `/user/profile/password` | 🔒 JWT | Change account password |

### Candidate Routes — `/candidates`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/candidates` | Public | List all candidates |
| POST | `/candidates` | 🔒 Admin | Add new candidate |
| PUT | `/candidates/:id` | 🔒 Admin | Update candidate details |
| DELETE | `/candidates/:id` | 🔒 Admin | Remove a candidate |
| GET | `/candidates/vote/:id` | 🔒 Voter | Cast vote for candidate |
| GET | `/candidates/vote/count` | Public | Get live vote count |

---

## 🔒 Security Design Decisions

**Why can't voters delete their accounts?**
This platform follows government voting system design. Once registered, a voter record is permanent for legal and audit purposes — consistent with real systems like Voter ID and Aadhar. Deactivation must go through official admin channels only.

**Why only one admin?**
To prevent privilege escalation. The system enforces a single admin at the application level.

**Why Aadhar Card Number as login identifier?**
It acts as a unique national identifier ensuring one registration per citizen and preventing duplicate voter registrations.

---

## 🌐 Deployment

**Backend** — [Railway](https://railway.app) or [Render](https://render.com)

**Frontend** — [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

**DDoS Protection** — Place [Cloudflare](https://cloudflare.com) in front of your backend for free DDoS mitigation, bot filtering, and CDN.

---

## 📄 Environment Variables

All required environment variables are documented in `backend/.env.example`. No actual values are included in this repository.

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch — `git checkout -b feature/your-feature`
3. Commit — `git commit -m "feat: describe your change"`
4. Push — `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📝 License

Licensed under the [MIT License](LICENSE).
