import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("registrations.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    age INTEGER NOT NULL,
    parentName TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    competitionType TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/register", (req, res) => {
    const { fullName, age, parentName, phoneNumber, competitionType } = req.body;

    if (!fullName || !age || !parentName || !phoneNumber || !competitionType) {
      return res.status(400).json({ error: "Semua field harus diisi" });
    }

    try {
      const stmt = db.prepare(`
        INSERT INTO registrations (fullName, age, parentName, phoneNumber, competitionType)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(fullName, age, parentName, phoneNumber, competitionType);
      res.json({ id: result.lastInsertRowid, success: true });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Gagal menyimpan pendaftaran" });
    }
  });

  app.get("/api/registrations", (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM registrations ORDER BY createdAt DESC").all();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Gagal mengambil data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
