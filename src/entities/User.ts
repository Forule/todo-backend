import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Todo } from "./entities.js"; // Importiere deine Todo-Entity

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string; // Hier speichern wir später nur den HASH!

  // Ein User kann viele Todos haben
  @OneToMany(() => Todo, (todo) => todo.user)
  todos!: Todo[];
}