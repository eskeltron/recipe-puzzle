import { Application } from "express";
import { signIn } from "./signIn";
import { signUp } from "./signUp";

export const routes = (app:Application) => {
    app.route('signIn')
        .post(signIn)
    app.route('signUp')
        .post(signUp)
}
