import type { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { respondWithJSON } from "./json.js";

export async function handlerCreateUser( req: Request, res: Response) {
    const user = await createUser(req.body as NewUser);
    respondWithJSON(res, 201, {
        id: user.id, 
        email: user.email, 
        createdAt: user.createdAt, 
        updatedAt: user.updatedAt
    });
}