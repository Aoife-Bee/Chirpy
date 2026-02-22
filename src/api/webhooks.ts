import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { upgradeUserToChirpyRed } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "./errors.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";

export async function handlerWebhooks(req: Request, res: Response) {
    const apiKey = getAPIKey(req);
    if (apiKey !== config.api.polkaKey) {
        throw new UnauthorizedError("Invalid API Key");
    }
    
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