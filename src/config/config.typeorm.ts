import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config'
import { User } from "src/auth/user/user.entity";

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.RDS_HOST || dbConfig.host,
    port: process.env.RDS_HOST || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD ||  dbConfig.password,
    database: process.env.RDS_DATABASE || dbConfig.database,
    entities: [User],
    synchronize: true
}