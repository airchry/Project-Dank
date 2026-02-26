import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import path from "path";
import dotenv from "dotenv";
import pool from "./pool.js";

// import routes
import feedRoutes from "./routes/feedRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import vaultRoutes from "./routes/vaultRoutes.js";
import authRouter from "./routes/authRoutes.js";
import gameRouter from "./routes/gameRoutes.js";
import crewRouter from "./routes/crewRoutes.js";
import quotesRouter from "./routes/quotesRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONT_END_URL,
  credentials: true
}));

app.set("trust proxy", 1);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "none",
    httpOnly: true,
    maxAge: 60 * 60 * 1000 * 24
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ["identify"]
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE discord_id = $1 AND is_active = true",
      [profile.id]
    )

    if (result.rows.length === 0) {
      return done(null, false)
    }

    const user = result.rows[0]

    await pool.query(
      "UPDATE users SET username=$1 WHERE discord_id=$2",
      [profile.username, profile.id]
    )

    return done(null, user)
  } catch (err) {
    return done(err, null)
  }
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/feedupdate", feedRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/auth", authRouter);
app.use("/api/games", gameRouter);
app.use("/api/crew", crewRouter);
app.use("/api/quotes", quotesRouter);

app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/", (req, res) => {
  res.send("Backend is running.");
});

app.get("/test-users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    console.log("DATA:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on ${port}`);
});