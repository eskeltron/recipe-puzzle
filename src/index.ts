import "reflect-metadata"
import { startServer } from "./app";
import { connect } from './config/typeorm'

async function main(){
    try{
        await connect();
        const app = await startServer();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT);
        console.log(`Server on port 3000`);
    }catch(e){
        console.log(e);
    } 
}

main();