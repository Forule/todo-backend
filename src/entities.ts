import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"


@Entity()
export class Todo {
    @PrimaryGeneratedColumn("uuid")
    id!: string
    
    @Column({type: "varchar"})
    name!: string

    @Column({type: "boolean", default: false})
    completed: boolean = false

}