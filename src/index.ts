import "reflect-metadata";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { database } from "./database.js";
import { Todo } from "./entities/entities.js";
import { stringify } from "node:querystring";

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // Hier die URL deines Frontends eintragen!
  methods: ["GET", "POST", "PATCH", "DELETE"]
}));
app.use(express.json());

const PORT = 3000;

// Die Hauptfunktion verbindet die DB und startet danach den Server
async function startServer() {
  try {
    // 1. Verbindung zur Postgres-DB herstellen
    await database.initialize();
    console.log("✅ Mit PostgreSQL verbunden");

    const todoRepo = database.getRepository(Todo);

    // --- ROUTES ---

    // ALLE ABFRUFEN
    app.get("/todos", async (_req: Request, res: Response) => {
      const allTodos = await todoRepo.find();
      res.json(allTodos);
    });

    // NEUES SPEICHERN
    app.post("/todos", async (req: Request, res: Response) => {
      // Wichtig: In deiner Entity heißt das Feld 'name', nicht 'title'!
      const newTodo = todoRepo.create(req.body); 
      await todoRepo.save(newTodo);
      res.status(201).json(newTodo);
    });

    // LÖSCHEN
    app.delete("/todos/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      await todoRepo.delete(id as string);
      res.status(204).send();
    });

    // STATUS ÄNDERN (PATCH)
    app.patch("/todos/:id", async (req: Request, res: Response) => {
      const { id } = req.params;
      const todo = await todoRepo.findOneBy({ id: id as string });

      if (todo) {
        todo.completed = !todo.completed;
        await todoRepo.save(todo);
        res.json(todo);
      } else {
        res.status(404).json({ message: "Todo nicht gefunden" });
      }
    });

    // 2. Server erst starten, wenn DB bereit ist
    app.listen(PORT, () => {
      console.log(`🚀 Server läuft auf http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Fehler beim Starten des Servers:", error);
  }
}

startServer();