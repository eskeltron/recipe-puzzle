import { AuthenticationError } from "apollo-server-express";
import { User } from "../entity/User";

export async function validateUser(email:string, id:number){
    if(!email || !id) throw new AuthenticationError('You need to authenticated first.');

    const user = await User.findOne({where:{email, id}});

    if(!user) throw new Error('User for this email not found.');
}