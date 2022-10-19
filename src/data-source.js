import "reflect-metadata"
import { DataSource } from "typeorm"
import { Post } from "./entity/Post"
import { Tag } from "./entity/Tag"
import { PostTag } from "./entity/PostTag"

// docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=test -d postgres
export const PostgresDataSource = new DataSource({
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
    // entities: [__dirname + "/entity/*.js"],
    entities: [PostTag, Tag, Post],
    migrations: [],
    subscribers: [],
})

/**
docker run -d --name oracle \
  -p 1521:1521 -p 5500:5500 \
  -e ORACLE_PDB=ORCLPDB1 \
  -e ORACLE_PWD=password \
  -e INIT_SGA_SIZE=1536 -e INIT_PGA_SIZE=512 \
  -v oracle:/opt/oracle/oradata
  oracledb19c/oracle.19.3.0-ee:oracle19.3.0-ee

// CLI
docker exec -it oracle sqlplus sys/password@ORCLPDB1 as sysdba

```sql
CREATE USER dev IDENTIFIED BY <user password>;
GRANT CONNECT, RESOURCE TO dev;
ALTER USER dev QUOTA UNLIMITED ON USERS;
COMMIT;
EXIT;
```
*/
export const OracleDataSource = new DataSource({
    type: "oracle",
    host: "localhost",
    username: "dev",
    password: "test",
    connectString: "localhost:1521/ORCLPDB1",
    synchronize: true,
    dropSchema: true,
    logging: true,
    // Uncomment below for compiled js
    // entities: [__dirname + "/entity/*.js"],
    entities: [PostTag, Tag, Post],
    migrations: [],
    subscribers: [],
})

export default OracleDataSource;