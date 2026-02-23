import { Router } from "express";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Login Discord
router.get("/discord", passport.authenticate("discord"));

// Callback Discord
router.get(
  "/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(process.env.FRONT_END_URL);
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONT_END_URL);
  });
});

// Cek login session
router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

export default router;
