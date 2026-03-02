import "reflect-metadata"
import express, { type Request, type Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { database } from "./database.js";


const app = express();

app.use(cors());
app.use(express.json());

database.initialize()

interface Todo {
  id: string | number;
  title?: string;
  completed?: boolean;
}

const DATA_FILE = path.join("./", "todos.json");

function loadTodos(): Todo[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];

    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data) as Todo[];
  } catch (error) {
    console.error("Fehler beim Laden", error);
    return [];
  }
}

function saveTodos(data: Todo[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Fehler beim Speichern", error);
  }
}

let todos: Todo[] = loadTodos();

app.get("/todos", (_req: Request, res: Response) => {
  res.json(todos);
});

app.post("/todos", (req: Request, res: Response) => {
  const newTodo: Todo = req.body;

  todos.push(newTodo);
  saveTodos(todos);

  res.status(201).json(newTodo);
});

app.delete("/todos/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  todos = todos.filter((t) => String(t.id) !== id);
  saveTodos(todos);

  res.status(204).send();
});

app.patch("/todos/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const todo = todos.find((t) => String(t.id) === id);

  if (todo) {
    todo.completed = !todo.completed;
    saveTodos(todos);
    res.json(todo);
  } else {
    res.status(404).json({ message: "Todo nicht gefunden" });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Server läuft auf http://localhost:${PORT}");
});