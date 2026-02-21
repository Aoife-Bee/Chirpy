import type { Request, Response } from "express";
import { createUser, updateUserEmail, updateUserPassword } from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { config } from "../config.js"

export async function handlerCreateUser( req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    };
    const params: parameters = req.body;

    if (!params.email) {
        throw new BadRequestError("Missing required fields: email");
    }
    if (!params.password) {
        throw new BadRequestError("Missing required fields: password");
    }
    const hashedPassword = await hashPassword(params.password)

    const user = await createUser({ email: params.email, hashedPassword: hashedPassword });

    if (!user) {
        throw new Error("Could not create user");
    }

    respondWithJSON(res, 201, {
        id: user.id, 
        email: user.email, 
        createdAt: user.createdAt, 
        updatedAt: user.updatedAt,
    });
}

export async function handlerUpdateUser( req:Request, res: Response) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);

    if (!req.body.email || !req.body.password) {
        throw new BadRequestError("Missing email or password")
    };

    const hashedPassword = await hashPassword(req.body.password);
    let user = await updateUserEmail(userId, req.body.email);
    user = await updateUserPassword(userId, hashedPassword);



    respondWithJSON(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    });
}