import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Todo } from "./entities.js"; 

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  username!: string;

  @Column({type: "varchar"})
  password!: string;

  
  @OneToMany(() => Todo, (todo) => todo.user)
  todos!: Todo[];
}