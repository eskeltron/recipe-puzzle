import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//I know that adding " || '' " to the end of the line is wrong practice, but if I don't do this then typescript will declare SECRET_KEY as "undefined" and it will break the jwt.verify :(. I saw on internet some scripts that the solution for this problem is coding an interface exclusive for process.env. But I dont know if it's a good practice.

const SECRET_KEY = process.env["SECRET_KEY"] || '';

const signUp = async ({ req, res }:ExpressContext ) => {
    const { email, password } = req.body;
    const theUser = await User.findOne({ email });

    console.log(theUser);

    if (!theUser) {
        res.status(404).send({
            success: false,
            message: `Could not find account: ${email}`,
        });
        return;
    }

    const match = await bcrypt.compare(password, theUser.password);

    if (!match) {
        //return error to user to let them know the password is incorrect
        res.status(401).send({
            success: false,
            message: "Incorrect credentials",
        });
        return;
    }

    const token = jwt.sign({ email: theUser.email, id: theUser.id }, SECRET_KEY);

    res.send({
        success: true,
        token: token,
    });
}

const asd = 'test'

export {
    signUp
}