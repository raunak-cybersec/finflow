<div align="center">

# 💸 FinFlow

### Your Intelligent Personal Finance Dashboard

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Cloud-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org)

A **production-quality**, dark-themed personal finance web app with JWT authentication, full CRUD transactions, budget tracking, AI-powered insights, and beautiful Chart.js visualizations.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth System** | JWT tokens in httpOnly cookies. Signup, login, logout. Persistent sessions across refreshes. |
| 📊 **Dashboard** | Net balance, income, expenses, savings rate cards. 30-day spending line chart. Expense donut chart. |
| 💳 **Transactions** | Full CRUD. Filter by type/category. Search by description. Paginated list (10/page). CSV export. |
| 🎯 **Budget Tracker** | Set monthly budgets per category. Animated progress bars. Red when overspent. |
| 🤖 **AI Insights** | Analyzes real data: spend spikes, savings projections, category breakdowns, daily averages. |
| 📱 **Responsive** | Mobile-first. Sidebar on desktop, bottom nav on mobile. |
| 🌱 **Auto-Seed** | 15 realistic transactions + 6 default budgets seeded on first signup. |

---

## 🎨 Design System

- **Background:** `#080810` (Deep Navy/Black)
- **Accent Primary:** `#818cf8` (Indigo)
- **Accent Success:** `#34d399` (Emerald)  
- **Accent Info:** `#22d3ee` (Cyan)
- **Danger:** `#f87171` (Red)
- **Cards:** Glassmorphism with `backdrop-filter: blur(20px)`
- **Heading Font:** Syne (Google Fonts)
- **Number Font:** JetBrains Mono
- **Animations:** Orb backgrounds, micro-animations, page transitions

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + Vite 6
- Tailwind CSS 4 (CSS-first config)
- Chart.js 4 + react-chartjs-2
- React Router DOM v7
- Axios (with proxy to backend)
- react-hot-toast
- Lucide React icons
- date-fns

**Backend**
- Node.js + Express 5
- MongoDB Atlas + Mongoose 9
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- cookie-parser (httpOnly cookies)
- dotenv

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd finflow
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/finflow?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_change_this
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **Get your MongoDB Atlas URI:**
> 1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
> 2. Create a free cluster
> 3. Click **Connect** → **Connect your application**
> 4. Copy the connection string and replace `<username>` and `<password>`

Start the backend:

```bash
npm run dev
# Server running at http://localhost:5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
# App running at http://localhost:5173
```

### 4. Open the app

Navigate to `http://localhost:5173` and create an account. Sample transactions will be seeded automatically! 🎉

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | ❌ | Register + seed data |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/logout` | ❌ | Clear session |
| GET | `/api/auth/me` | ✅ | Get current user |
| GET | `/api/transactions` | ✅ | List (filter, search, paginate) |
| POST | `/api/transactions` | ✅ | Create transaction |
| PUT | `/api/transactions/:id` | ✅ | Update transaction |
| DELETE | `/api/transactions/:id` | ✅ | Delete transaction |
| GET | `/api/budgets` | ✅ | Get all budgets |
| PUT | `/api/budgets` | ✅ | Upsert category budget |
| GET | `/api/insights` | ✅ | AI-generated insights |

---

## 📁 Project Structure

```
finflow/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # MongoDB Atlas connection
│   │   ├── controllers/          # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   ├── budgetController.js
│   │   │   └── insightController.js
│   │   ├── middleware/auth.js     # JWT protection
│   │   ├── models/               # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Transaction.js
│   │   │   └── Budget.js
│   │   ├── routes/               # Express routers
│   │   ├── services/seedService.js
│   │   └── index.js              # Entry point
│   └── .env
└── frontend/
    ├── src/
    │   ├── api/axios.js           # Axios instance
    │   ├── components/            # UI components
    │   │   ├── charts/
    │   │   ├── Layout.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── CategoryBadge.jsx
    │   │   └── TransactionModal.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/                 # Route pages
    │   │   ├── DashboardPage.jsx
    │   │   ├── TransactionsPage.jsx
    │   │   ├── BudgetsPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── SignupPage.jsx
    │   ├── utils/helpers.js
    │   └── index.css              # Global styles + design system
    └── vite.config.js
```

---

## 🌱 Sample Data

On first signup, FinFlow automatically seeds:
- **Income:** Monthly salary, two freelance payments
- **Expenses:** Groceries, dining, Swiggy, metro, Uber, rent, utilities, gym, Netflix, shopping
- **Budgets:** Pre-set limits for Food, Transport, Housing, Health, Entertainment, Shopping

---

## 📄 License

MIT
