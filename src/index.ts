import "reflect-metadata";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { database } from "./database.js";
import { Todo } from "./entities/entities.js";
import { stringify } from "node:querystring";
import bcrypt from 'bcrypt';
import { User } from './entities/User.js';


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

    app.post("/register", async (req, res) => {

      try{
        const { username, password} = req.body;

        if(!username || !password){
          return res.status(400).json({message: "Bitte Name und Passwort angeben!"})
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const userRepositry = database.getRepository(User)

        const newUser = userRepositry.create({
          username,
          password: hashedPassword
        })
        
        await userRepositry.save(newUser)
        res.status(201).json({ message: "Account erfolgreich erstellt!" })
      } catch (error: any){

        if (error.code === '23505') {
          return res.status(400).json({ message: "Dieser Nutzername ist schon vergeben." });
        }
        console.error(error);
        res.status(500).json({ message: "Da ist was schiefgelaufen..." });
      }

      }
    )

    app.post("/login", async (req, res) => {

      try{
        const {username, password} = req.body

        const userRepositry = database.getRepository(User)
        
        const user = await userRepositry.findOneBy({username})
        
        if(!user){

          return res.status(401).json({ message: "Ungültige Anmeldedaten." });

        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {

          return res.status(401).json({ message: "Ungültige Anmeldedaten." });

        }

        res.json({ 
        message: "Login erfolgreich!",
        user: { id: user.id, username: user.username }
        })


      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Interner Serverfehler" });
      }


    })

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