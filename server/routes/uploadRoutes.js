import pool from "../pool.js"
import { Router } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { ensureAuth } from "./vaultRoutes.js"

const router = Router()

/* ========= UPLOAD SETUP ========= */
const uploadDir = path.resolve("uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`

    cb(null, uniqueName)
  },
})

const upload = multer({ storage })

/* ========= UPLOAD ROUTE ========= */
router.post("/upload", ensureAuth, upload.single("video"), async (req, res) => {
    try {
      const { title, game, description, type, tags } = req.body
      const file = req.file

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" })
      }

      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" })
      }

      const parsedTags = tags ? JSON.parse(tags) : []

      const uploaderId = req.user.id
      const uploaderUsername = req.user.username
      const uploaderAvatar = req.user.avatar
        ? `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`
        : null

      await pool.query(
        `
        INSERT INTO clips
        (
          title,
          game,
          description,
          type,
          tags,
          file_path,
          uploader_id,
          uploader_username,
          uploader_avatar,
          views
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,0)
        `,
        [
          title,
          game,
          description,
          type,
          JSON.stringify(parsedTags),
          file.filename,
          uploaderId,
          uploaderUsername,
          uploaderAvatar,
        ]
      )

      res.json({ ok: true })
    } catch (err) {
      console.error("UPLOAD ERROR:", err)
      res.status(500).json({ error: "Upload failed" })
    }
  }
)

/* ========= GET VIDEOS ========= */
router.get("/videos", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM clips ORDER BY created_at DESC"
  )

  res.json(rows)
})

export default router
