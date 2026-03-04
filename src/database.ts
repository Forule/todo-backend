import "reflect-metadata"
import {DataSource} from "typeorm"
import { Todo } from "./entities/entities.js"

export const database: DataSource = new DataSource({

    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "devuser",
    password: "devpass",
    database: "todo",
    synchronize: true,
    entities: [Todo],

})


