import { createConnection } from "typeorm";
import path from "path";

export async function connect(){
    try {
        const env = process.env['NODE_ENV'];
        console.log(env);
        await createConnection({
            type: 'mysql',
            host: env == 'production' ? 'sql9.freemysqlhosting.net' : 'localhost',
            port: 3306,
            username: env == 'production' ? 'sql9369465' : 'root',
            password: env == 'production' ? 'XiRk9TwdDs' : '1234',
            database: env == 'production' ? 'sql9369465' : 'Ejercicio',
            entities: [
                path.join(__dirname, '../entity/**/**.ts')
            ],
            synchronize: true
        });
        console.log('Database is connected');   
    } catch (error) {
        console.log(error);
    }
}