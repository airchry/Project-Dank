import { Router } from "express";
import pool from "../pool.js"

const router = Router();

router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM quotes");
  res.json(result.rows);
});

export default router;