import express from 'express';
import { ApolloServer } from "apollo-server-express";
import { buildSchema  } from "type-graphql";
import { PingResolver } from "./graphql/resolvers/ping";
import { UserResolver } from "./graphql/resolvers/UserResolver";
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { RecipeResolver } from './graphql/resolvers/RecipeResolver';
import { CategoryResolver } from './graphql/resolvers/CategoryResolver';
import jwt from 'jsonwebtoken';

import { SECRET_KEY } from "./utils/secretKey";

export async function startServer(){
    const app = express();

    const context = ({ req, res }:ExpressContext) => {
        let decodedToken = null;
        try{
            const token = req.headers.authorization;
            if(token) decodedToken = jwt.verify(token, SECRET_KEY);
        } catch(e) {
            console.log(e);
        } finally {
            return decodedToken
        }
    }

    const schema = await buildSchema({
        resolvers:[
            PingResolver, 
            UserResolver,
            RecipeResolver,
            CategoryResolver
        ]
    })

    const server = new ApolloServer({schema, context});

    server.applyMiddleware({app, path: '/graphql'});

    return app;
}