import pool from "../pool.js";
import crypto from "crypto";
import { Router } from "express";
import { ensureAuth } from "./vaultRoutes.js";

const router = Router();


// ======================================================
// GET FEEDS (WITH PAGINATION + COUNT)
// ======================================================
router.get("/", ensureAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const limit = Number(req.query.limit) || 5;
    const offset = Number(req.query.offset) || 0;

    const { rows } = await pool.query(
      `
      SELECT 
        f.*,
        COUNT(DISTINCT l.id) AS likes,
        COUNT(DISTINCT c.id) AS comments,
        BOOL_OR(l.user_id = $1) AS liked,
        COALESCE(
          JSON_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
              'id', c.id,
              'author', c.author,
              'content', c.content,
              'created_at', c.created_at
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'
        ) AS comment_list
      FROM feeds f
      LEFT JOIN feed_likes l ON f.id = l.feed_id
      LEFT JOIN feed_comments c ON f.id = c.feed_id
      GROUP BY f.id
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [userId, limit, offset]
    );

    res.json(rows);

  } catch (err) {
    console.error("GET FEED ERROR:", err);
    res.status(500).json({ error: "Failed to fetch feeds" });
  }
});




// ======================================================
// CREATE POST
// ======================================================
router.post("/", ensureAuth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Text required" });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO feeds
      (id, author, avatar, content, type)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        crypto.randomUUID(),
        req.user.username,
        req.user.avatar
          ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`
          : null,
        text.trim(),
        "status"
      ]
    );

    res.status(201).json(rows[0]);

  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ error: "Failed to create feed" });
  }
});


// ======================================================
// TOGGLE LIKE
// ======================================================
router.post("/:id/like", ensureAuth, async (req, res) => {
  const feedId = req.params.id;
  const userId = req.user.id;

  try {
    const existing = await pool.query(
      "SELECT id FROM feed_likes WHERE feed_id=$1 AND user_id=$2",
      [feedId, userId]
    );

    let liked;

    if (existing.rows.length > 0) {
      await pool.query(
        "DELETE FROM feed_likes WHERE feed_id=$1 AND user_id=$2",
        [feedId, userId]
      );
      liked = false;
    } else {
      await pool.query(
        `
        INSERT INTO feed_likes (id, feed_id, user_id)
        VALUES ($1,$2,$3)
        `,
        [crypto.randomUUID(), feedId, userId]
      );
      liked = true;
    }
    const { rows } = await pool.query(
      "SELECT COUNT(*) FROM feed_likes WHERE feed_id=$1",
      [feedId]
    );

    res.json({
      liked,
      totalLikes: Number(rows[0].count)
    });

  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ error: "Like failed" });
  }
});


// ======================================================
// ADD COMMENT
// ======================================================
router.post("/:id/comment", ensureAuth, async (req, res) => {
  const feedId = req.params.id;
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ error: "Comment text required" });
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO feed_comments (id, feed_id, user_id, author, content)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        crypto.randomUUID(),
        feedId,
        req.user.id,
        req.user.username,
        text.trim()
      ]
    );

    res.json(rows[0]);

  } catch (err) {
    console.error("COMMENT ERROR:", err);
    res.status(500).json({ error: "Comment failed" });
  }
});

export default router;
