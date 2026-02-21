import type { Request, Response } from "express";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { UnauthorizedError } from "./errors.js";
import { getUserByEmail } from "../db/queries/users.js";
import { config } from "../config.js";

export async function handlerLogin(req: Request, res: Response ) {
    const user = await getUserByEmail(req.body.email);
    if (!user) {
        throw new UnauthorizedError("Incorrect email or password");
    }

    const valid = await checkPasswordHash( req.body.password, user.hashedPassword);
    let expiresIn: number;

    if (!req.body.expiresInSeconds) {
        expiresIn = 3600
    } else {
        expiresIn = Math.min(req.body.expiresInSeconds, 3600);
    }
    


    if (valid === true) {
        respondWithJSON(res, 200, {
        id: user.id, 
        createdAt: user.createdAt, 
        updatedAt: user.updatedAt,
        email: user.email, 
        token: makeJWT(user.id, expiresIn, config.jwt.secret)
        }
        );
    }
    else {
        throw new UnauthorizedError("Incorrect email or password");
    }
};