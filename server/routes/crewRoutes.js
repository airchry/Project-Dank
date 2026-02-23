import { Router } from "express";
import pool from "../pool.js";

const router = Router();

// GET all members
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM crew_members ORDER BY name ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single member
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM crew_members WHERE id=$1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE member (admin only)
router.post("/", async (req, res) => {
  const { name, nickname, avatar, role, panicLevel, specialty, famousFor, funFacts, gamesPlayed, deaths } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO crew_members 
       (name, nickname, avatar, role, panic_level, specialty, famous_for, fun_facts, games_played, deaths)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [name, nickname, avatar, role, panicLevel, specialty, famousFor, funFacts, gamesPlayed, deaths]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create member" });
  }
});

// UPDATE member (admin only)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, nickname, avatar, role, panic_level, specialty, famous_for, fun_facts, games_played, deaths } = req.body;
  try {
    const result = await pool.query(
      `UPDATE crew_members SET
         name=$1, nickname=$2, avatar=$3, role=$4, panic_level=$5, specialty=$6, famous_for=$7, fun_facts=$8, games_played=$9, deaths=$10, updated_at=NOW()
       WHERE id=$11 RETURNING *`,
      [name, nickname, avatar, role, panic_level, specialty, famous_for, fun_facts, games_played, deaths, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update member" });
  }
});

// DELETE member (admin only)
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM crew_members WHERE id=$1", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete member" });
  }
});

export default router;
