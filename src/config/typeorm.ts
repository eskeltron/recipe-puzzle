import { createConnection } from "typeorm";
import path from "path";

export async function connect(){
    try {
        const env = process.env['NODE_ENV'];
        const isProd = env === 'production';

        await createConnection({
            type: 'mysql',
            host: isProd ? 'sql10.freemysqlhosting.net' : 'localhost',
            port: 3306,
            username: isProd ? 'sql10371019' : 'root',
            password: isProd ? 'VTSxnrY3af' : '1234',
            database: isProd ? 'sql10371019' : 'Ejercicio',
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
