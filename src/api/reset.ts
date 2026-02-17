import type { Request, Response } from "express";
import { respondWithError } from "./json.js";
import { config } from "../config.js";
import { resetAllUsers } from "../db/queries/users.js";

export async function handlerReset( req: Request, res: Response) {
    if (config.api.platform !== "dev") {
        respondWithError(res, 403, "Forbidden");
        return;
    }

    config.api.fileServerHits = 0;
    await resetAllUsers();
    res.send("OK");
};