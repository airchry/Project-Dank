import { Router } from "express";
import pool from "../pool.js";
import getYoutubeVideos from "../services/youtubeService.js";

const router = Router();

export function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

router.get("/vault", ensureAuth, async (req, res) => {
  const youtube = await getYoutubeVideos();

  const { rows } = await pool.query(
    "SELECT * FROM clips ORDER BY created_at DESC"
  );

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  const local = rows.map(row => ({
    id: row.id,
    source: "local",
    title: row.title,
    type: row.type,
    game: row.game,
    tags: row.tags || [],
    views: row.views || 0,
    uploader: row.uploader_username,
    thumbnail: row.type === "image"
      ? `${baseUrl}/uploads/${row.file_path}`
      : null,
    videoUrl: `${baseUrl}/uploads/${row.file_path}`,
    createdAt: row.created_at,
  }));

  res.json([...local, ...youtube]);
});


export default router;
