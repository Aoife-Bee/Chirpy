import type { Request, Response } from "express";
import { checkPasswordHash } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { UnauthorizedError } from "./errors.js";
import { getUserByEmail } from "../db/queries/users.js";

export async function handlerLogin(req: Request, res: Response) {
    const user = await getUserByEmail(req.body.email);

    if (!user) {
        throw new UnauthorizedError("Incorrect email or password");
    }

    const valid = await checkPasswordHash( req.body.password, user.hashedPassword);

    if (valid === true) {
        respondWithJSON(res, 200, {
                    id: user.id, 
        email: user.email, 
        createdAt: user.createdAt, 
        updatedAt: user.updatedAt,
        }
        );
    }
    else {
        throw new UnauthorizedError("Incorrect email or password");
    }
};