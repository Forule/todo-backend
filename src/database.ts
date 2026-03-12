import "reflect-metadata"
import {DataSource} from "typeorm"
import { Todo } from "./entities/entities.js"
import { User } from "./entities/User.js"

export const database: DataSource = new DataSource({

    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: Number (process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || "devuser",
    password: process.env.DATABASE_PASSW || "devpass",
    database: process.env.DATABASE_NAME || "todo",
    synchronize: true,
    entities: [Todo, User],
    connectTimeoutMS: 5000

})
