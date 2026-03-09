import {Column, Entity, PrimaryGeneratedColumn, ManyToOne} from "typeorm"
import { User } from "./User.js";


@Entity()
export class Todo {
    @PrimaryGeneratedColumn("uuid")
    id!: string
    
    @Column({type: "varchar"})
    name!: string

    @Column({type: "boolean", default: false})
    completed: boolean = false

    @ManyToOne(() => User, (user) => user.todos, { nullable: true, eager: true })
    user!: User;

}