import { config } from "dotenv";
config();

//I know that adding " || '' " to the end of the line is wrong practice, but if I don't do this then typescript will declare SECRET_KEY as "undefined" and it will break the jwt.verify :(. I saw on internet some scripts that the solution for this problem is coding an interface exclusive for process.env. But I dont know if it's a good practice.

const SECRET_KEY = process.env["SECRET_KEY"] || ''

export {SECRET_KEY} 
    