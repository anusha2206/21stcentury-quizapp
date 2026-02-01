# Quiz Application

A full-stack web-based quiz application that allows users to take quizzes through a responsive interface, with dynamic question handling powered by a Node.js backend and a serverless PostgreSQL database.

## 🚀 Features

* Responsive quiz UI built with HTML and CSS
* RESTful APIs for quiz data management
* Dynamic question retrieval and scoring
* Serverless PostgreSQL database using Neon
* Clean separation of frontend and backend

## 🛠️ Tech Stack

**Frontend:** HTML, CSS, JavaScript
**Backend:** Node.js, REST APIs
**Database:** Neon (Serverless PostgreSQL)

## 📁 Project Structure

```
quiz-app/
├── Frontend/
│   ├── index.html
│   ├── quiz.html
│   └── other UI pages
├── backend/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/quiz-app.git
cd quiz-app
```

### 2️⃣ Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```
DATABASE_URL=your_neon_database_url
```

Start the server:

```bash
node index.js
```

### 3️⃣ Frontend

Open the `Frontend/index.html` file in a browser to use the application.

## 🔒 Security Note

Environment variables (`.env`) are excluded from version control using `.gitignore` to protect sensitive credentials.

## 📌 Future Improvements

* User authentication
* Timer-based quizzes
* Admin panel for quiz management
* Deployment with live frontend and backend URLs

---

Built as part of a full-stack development learning project.
