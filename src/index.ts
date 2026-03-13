import "reflect-metadata";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { database } from "./database.js";
import { Todo } from "./entities/entities.js";
import { stringify } from "node:querystring";
import bcrypt from 'bcrypt';
import { User } from './entities/User.js';
import jwt from 'jsonwebtoken';


const app = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PATCH", "DELETE"]
}));
app.use(express.json());

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// --- AUTH MIDDLEWARE ---
// Extends Request to include userId from JWT
interface AuthRequest extends Request {
  userId?: string;
}

// Middleware to verify JWT token and extract userId
function authenticateToken(req: AuthRequest, res: Response, next: Function) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  
  if (!token) return res.status(401).json({ message: "Token required" });
  
  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
}

// Die Hauptfunktion verbindet die DB und startet danach den Server
async function startServer() {
  try {
    console.log("server startet")
    // 1. Verbindung zur Postgres-DB herstellen
    await database.initialize();
    console.log("✅ Mit PostgreSQL verbunden");

    const todoRepo = database.getRepository(Todo);

    // ALLE ABFRUFEN - Nur Todos des eingeloggten Users
    app.get("/todos", authenticateToken, async (req: AuthRequest, res: Response) => {
      const userId = req.userId!;
      const allTodos = await todoRepo.find({
        where: { user: { id: userId } }
      });
      //console.log(allTodos)
      res.json(allTodos.map((todo) => {  
        
        return ({

          id: todo.id,
          name: todo.name,
          completed: todo.completed,
          username: todo.user.username

        })
      
      
      
      } ));
    
    
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

        const token = jwt.sign(
          { userId: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: "3d" }
        );

        res.json({ 
        message: "Login erfolgreich!",
        token,
        user: { id: user.id, username: user.username }
        })


      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Interner Serverfehler" });
      }


    })

    // NEUES SPEICHERN - Automatisch dem eingeloggten User zuweisen
    app.post("/todos", authenticateToken, async (req: AuthRequest, res: Response) => {
      const userId = req.userId!;
      const newTodo = todoRepo.create({ 
        ...req.body, 
        user: { id: userId }  // Assign todo to current user
      }); 
      await todoRepo.save(newTodo);
      res.status(201).json(newTodo);
    });

    // LÖSCHEN - Nur eigene Todos löschen
    app.delete("/todos/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
      const { id } = req.params;
      const userId = req.userId!;
      
      const todo = await todoRepo.findOne({
        where: { id: id as string, user: { id: userId } }
      });
      
      if (!todo) {
        return res.status(404).json({ message: "Todo nicht gefunden oder nicht berechtigt" });
      }
      
      await todoRepo.delete(id as string);
      res.status(204).send();
    });

    // STATUS ÄNDERN (PATCH) - Nur eigene Todos ändern
    app.patch("/todos/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
      const { id } = req.params;
      const userId = req.userId!;
      
      const todo = await todoRepo.findOne({
        where: { id: id as string, user: { id: userId } }
      });

      if (todo) {
        todo.completed = !todo.completed;
        await todoRepo.save(todo);
        res.json(todo);
      } else {
        res.status(404).json({ message: "Todo nicht gefunden oder nicht berechtigt" });
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
