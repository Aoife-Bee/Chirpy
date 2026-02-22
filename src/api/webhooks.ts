import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { upgradeUserToChirpyRed } from "../db/queries/users.js";
import { NotFoundError } from "./errors.js";

export async function handlerWebhooks(req: Request, res: Response) {
    type parameters = { event: string, data: {userId: string} };

    const params: parameters = req.body;

    if (params.event !== "user.upgraded") {
        res.sendStatus(204);
        return;
    }
    const user = await upgradeUserToChirpyRed(params.data.userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }
    res.sendStatus(204);
}