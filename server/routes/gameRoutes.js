import { Router } from "express";
import pool from "../pool.js"

const router = Router();

// CREATE GAME
router.post("/", async (req, res) => {
  const { name, description, status, fun_fact, image_url, quotes, notes } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert ke games
    const gameResult = await client.query(
      `INSERT INTO games (name, description, status, fun_fact, image)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, description, status, fun_fact, image_url]
    );

    const gameId = gameResult.rows[0].id;

    // Insert quotes
    if (quotes && quotes.length > 0) {
      const quoteQuery =
        "INSERT INTO quotes (game_id, content) VALUES " +
        quotes.map((_, i) => `($1, $${i + 2})`).join(",");
      await client.query(quoteQuery, [gameId, ...quotes]);
    }

    // Insert notes
    if (notes && notes.length > 0) {
      const noteQuery =
        "INSERT INTO notes (game_id, content) VALUES " +
        notes.map((_, i) => `($1, $${i + 2})`).join(",");
      await client.query(noteQuery, [gameId, ...notes]);
    }

    await client.query("COMMIT");
    res.json({ id: gameId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to create game" });
  } finally {
    client.release();
  }
});

// GET GAME DETAIL
router.get("/:gameId", async (req, res) => {
  const { gameId } = req.params;
  try {
    // Ambil game
    const gameResult = await pool.query("SELECT * FROM games WHERE id = $1", [gameId]);
    if (gameResult.rows.length === 0) return res.status(404).json({ message: "Game not found" });

    const game = gameResult.rows[0];

    // Ambil quotes
    const quotesResult = await pool.query("SELECT content FROM quotes WHERE game_id = $1", [gameId]);
    const notesResult = await pool.query("SELECT content FROM notes WHERE game_id = $1", [gameId]);

    game.quotes = quotesResult.rows.map((r) => r.content);
    game.notes = notesResult.rows.map((r) => r.content);

    res.json(game);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE GAME
router.put("/:gameId", async (req, res) => {
  const { gameId } = req.params;
  const { name, description, image_url, status, fun_fact, quotes, notes } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Update games
    const result = await client.query(
      `UPDATE games
       SET name = $1,
           description = $2,
           image = $3,
           status = $4,
           fun_fact = $5,
           created_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [name, description, image_url, status, fun_fact, gameId]
    );

    // Update quotes: hapus dulu, insert baru
    if (quotes) {
      await client.query("DELETE FROM quotes WHERE game_id = $1", [gameId]);
      if (quotes.length > 0) {
        const quoteQuery =
          "INSERT INTO quotes (game_id, content) VALUES " +
          quotes.map((_, i) => `($1, $${i + 2})`).join(",");
        await client.query(quoteQuery, [gameId, ...quotes]);
      }
    }

    // Update notes: hapus dulu, insert baru
    if (notes) {
      await client.query("DELETE FROM notes WHERE game_id = $1", [gameId]);
      if (notes.length > 0) {
        const noteQuery =
          "INSERT INTO notes (game_id, content) VALUES " +
          notes.map((_, i) => `($1, $${i + 2})`).join(",");
        await client.query(noteQuery, [gameId, ...notes]);
      }
    }

    await client.query("COMMIT");
    res.json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  } finally {
    client.release();
  }
});

// GET ALL GAMES
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM games ORDER BY created_at DESC")
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// DELETE GAME
router.delete("/:gameId", async (req, res) => {
  const { gameId } = req.params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Hapus quotes dan notes terkait
    await client.query("DELETE FROM quotes WHERE game_id = $1", [gameId]);
    await client.query("DELETE FROM notes WHERE game_id = $1", [gameId]);

    // Hapus game itu sendiri
    const result = await client.query("DELETE FROM games WHERE id = $1 RETURNING *", [gameId]);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Game not found" });
    }

    await client.query("COMMIT");
    res.json({ message: "Game deleted successfully", game: result.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Failed to delete game" });
  } finally {
    client.release();
  }
});



export default router;
