import { createConnection } from "typeorm";
import path from "path";

export async function connect(){
    try {
        await createConnection({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '1234',
            database: 'Ejercicio',
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