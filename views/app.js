
import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);


const db = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// We can add a simple check to see if the pool can connect.
db.on('connect', () => {
    console.log('🟢 Database pool connected successfully.');
});
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));



const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/');
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie('token');
      return res.redirect('/');
    }
    req.user = decoded;
    next();
  });
};




// --- GET Routes ---

app.get('/', (req, res) => res.render("auth.ejs", { error: null }));
app.get('/form', verifyToken, (req, res) => res.render("form.ejs"));

app.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`[GET /dashboard] Fetching data for user ID: ${userId}`);
    // CHANGE: When using a Pool, you can query directly on the `db` object for simple queries.
    const userPromise = db.query('SELECT name, daily_focus_hours FROM users WHERE id = $1', [userId]);
    const schedulePromise = db.query(`SELECT * FROM schedule_items WHERE user_id = $1 ORDER BY CASE day_of_week WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3 WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6 ELSE 7 END, start_time`, [userId]);
    const streakPromise = db.query('SELECT streak_count, longest_streak FROM user_streaks WHERE user_id = $1', [userId]);

    const [userResult, scheduleResult, streakResult] = await Promise.all([userPromise, schedulePromise, streakPromise]);
    if (!userResult.rows.length) return res.redirect('/');

    const userData = userResult.rows[0];
    const scheduleItems = scheduleResult.rows;
    const streakData = streakResult.rows[0] || { streak_count: 0, longest_streak: 0 };
    const focusedTimeDisplay = userData.daily_focus_hours ? `${userData.daily_focus_hours} Hours/Day` : 'N/A';
    console.log(`[GET /dashboard] Rendering dashboard for ${userData.name}`);
    res.render("index.ejs", {
      name: userData.name,
      scheduleItems: scheduleItems,
      focusedTime: focusedTimeDisplay,
      streak_count: streakData.streak_count,
      longest_streak: streakData.longest_streak,
      insight: "Planning is the first step to success!",
    });
  } catch (error) {
    console.error("🔴 [GET /dashboard] Error:", error);
    res.status(500).send("Error loading dashboard.");
  }
});


// --- POST Routes ---

app.post('/register', async (req, res) => {
   
    const { name, email, password } = req.body;
    console.log(`[POST /register] Attempting to register user: ${email}`);
    if (!name || !email || !password) return res.render('auth.ejs', { error: 'All fields are required.' });
    try {
        const check = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (check.rows.length) return res.render('auth.ejs', { error: 'User with this email already exists.' });
        const hashedPwd = await bcrypt.hash(password, 10);
        const result = await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name', [name, email, hashedPwd]);
        const newUser = result.rows[0];
        const token = jwt.sign({ id: newUser.id, name: newUser.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
        console.log(`[POST /register] Success! Redirecting new user ${newUser.name} to /form.`);
        res.redirect('/form');
    } catch (err) {
        console.error('🔴 [POST /register] Error:', err);
        res.render('auth.ejs', { error: 'An internal server error occurred.' });
    }
});

app.post("/login", async (req, res) => {
    
    const { email, password } = req.body;
    console.log(`[POST /login] Attempting to log in user: ${email}`);
    if (!email || !password) return res.render('auth.ejs', { error: 'Email and password are required.' });
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (!result.rows.length) return res.render('auth.ejs', { error: 'User not found.' });
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.render('auth.ejs', { error: 'Incorrect password.' });
        console.log(`[POST /login] Login successful for ${user.name}.`);
        const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "Strict" });
        console.log(`[POST /login] Redirecting to /dashboard.`);
        res.redirect('/dashboard');
    } catch (err) {
        console.error("🔴 [POST /login] Error:", err);
        res.render('auth.ejs', { error: 'An internal server error occurred.' });
    }
});

app.post("/form", verifyToken, async (req, res) => {
    // 1. "Check out" a client from the pool.
    const client = await db.connect();
    try {
        console.log(`[POST /form] Generating schedule for user ID: ${req.user.id}`);
        const { goal, subjects, methods, deadline, remarks, dailytime, slots, flexibility } = req.body;
        const prompt = `Based on these study preferences, create a (${deadline})days schedule. The user has provided subjects with priorities. Your job is to schedule them. Preferences: Goal(${goal}), Subjects(${subjects}), Methods(${methods}), Deadline(${deadline}), Daily Time(${dailytime} hours), Slots(${slots}), Remarks(${remarks}). IMPORTANT: Respond with ONLY a valid JSON array of objects. Each object must have these keys: "dayOfWeek", "startTime", "endTime", "subject". The "subject" should come from user input. Example: [{"dayOfWeek": "Monday", "startTime": "09:00", "endTime": "11:00", "subject": "Math: Calculus Chapter 3"}]`;

        const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }).generateContent(prompt);
        let jsonResponse = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        const scheduleItems = JSON.parse(jsonResponse);
        console.log(`[POST /form] AI returned ${scheduleItems.length} schedule items.`);

        // 2. Use the checked-out client to run all queries in a transaction.
        await client.query('BEGIN');
        await client.query('DELETE FROM schedule_items WHERE user_id = $1', [req.user.id]);
        for (const item of scheduleItems) {
            await client.query('INSERT INTO schedule_items (day_of_week, start_time, end_time, subject, user_id) VALUES ($1, $2, $3, $4, $5)', [item.dayOfWeek, item.startTime, item.endTime, item.subject, req.user.id]);
        }
        await client.query('UPDATE users SET daily_focus_hours = $1 WHERE id = $2', [dailytime, req.user.id]);
        await client.query('COMMIT');

        console.log(`[POST /form] Successfully saved schedule. Redirecting to /dashboard.`);
        res.redirect('/dashboard');
    } catch (error) {
        // If anything fails, roll back the changes.
        await client.query('ROLLBACK');
        console.error("🔴 [POST /form] Error:", error);
        res.status(500).send("An error occurred while generating the schedule.");
    } finally {
        // 3. IMPORTANT: Release the client back to the pool so others can use it.
        client.release();
        console.log("[POST /form] Database client released.");
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});



app.listen(PORT, () => {
  console.log(`🟢 Server is running in SSR mode on http://localhost:${PORT}`);
});
