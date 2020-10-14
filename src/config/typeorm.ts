import { createConnection } from "typeorm";
import path from "path";

export async function connect(){
    try {
        const env = process.env['NODE_ENV'];
        const isProd = env === 'production';
        //The remote database is hosted by a free hosting. These configurations are only for testing the app. 
        await createConnection({
            type: 'mysql',
            host: isProd ? 'sql9.freemysqlhosting.net' : 'localhost',
            port: 3306,
            username: isProd ? 'sql9369465' : 'root',
            password: isProd ? 'XiRk9TwdDs' : '1234',
            database: isProd ? 'sql9369465' : 'Ejercicio',
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
