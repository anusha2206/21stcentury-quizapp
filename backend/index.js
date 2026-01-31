import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { neon } from "@neondatabase/serverless";

dotenv.config();
const app = express();
const sql = neon(process.env.DATABASE_URL);

app.use(cors());
app.use(express.json());

/* 
====================================
1️⃣ Get 10 random questions by category
====================================
*/
app.get("/api/questions/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  try {
    // Fetch 10 random questions for the chosen skill
    const questions = await sql`
      SELECT question_id, question_text, category_id
      FROM questions
      WHERE category_id = ${categoryId}
      ORDER BY random()
      LIMIT 10;
    `;

    const questionIds = questions.map(q => q.question_id);

    // Fetch options for those questions
    const options = await sql`
      SELECT * FROM answers WHERE question_id = ANY(${questionIds});
    `;

    // Format
    const formattedQuestions = questions.map(q => ({
      id: q.question_id,
      question: q.question_text,
      category_id: q.category_id,
      options: options
        .filter(o => o.question_id === q.question_id)
        .map(o => ({ id: o.option_id, text: o.option_text, marks: o.marks }))
    }));

    res.json(formattedQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* 
====================================
2️⃣ Submit answers & calculate score
====================================
*/
app.post("/api/submit", async (req, res) => {
  const { answers } = req.body; // [{question_id, selected_option_id}]
  try {
    const optionIds = answers.map(a => a.selected_option_id);

    // Fetch marks of selected options
    const selectedOptions = await sql`
      SELECT option_id, marks FROM answers 
      WHERE option_id = ANY(${optionIds});
    `;

    // Sum up the marks
    const score = selectedOptions.reduce((acc, opt) => acc + opt.marks, 0);

    // Total possible marks (10 questions → max marks depends on options design)
    const total = answers.length * 4; // assuming max 4 marks per question option

    res.json({ 
      score, 
      total, 
      percentage: ((score / total) * 100).toFixed(2) 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/signup", async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into DB
        await sql`
            INSERT INTO users (fullname, email, password)
            VALUES (${fullname}, ${email}, ${hashedPassword})
        `;

        res.json({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt with:", email);

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Missing email or password" });
    }

    try {
        // If you only use email for login:
        const result = await sql`
            SELECT * FROM users WHERE email = ${email} LIMIT 1
        `;
        console.log("Query result:", result);

        if (result.length === 0) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        const user = result[0];

        if (!user.password) {
            throw new Error("Password field is missing in database record");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Incorrect password" });
        }

        res.json({
            success: true,
            message: "Login successful",
            user: { id: user.id, email: user.email, fullname: user.fullname }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



//  app.listen(5000, () => console.log("Server running on http://localhost:5000"));

app.listen(3000, () => console.log("✅ API running at http://localhost:3000"));