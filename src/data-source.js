import "reflect-metadata"
import { DataSource } from "typeorm"
import { Post } from "./entity/Post"
import { Tag } from "./entity/Tag"
import { PostTag } from "./entity/PostTag"

// docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=test -d postgres
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "test",
    database: "postgres",
    synchronize: true,
    dropSchema: true,
    logging: true,
    // Uncomment below for compiled js
    // entities: ["dist/entity/*.js"],
    entities: [PostTag, Tag, Post],
    migrations: [],
    subscribers: [],
})
