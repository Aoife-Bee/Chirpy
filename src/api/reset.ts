import type { Request, Response } from "express";
import { ForbiddenError } from "./errors.js";
import { config } from "../config.js";
import { resetAllUsers } from "../db/queries/users.js";

export async function handlerReset( req: Request, res: Response) {
    if (config.api.platform !== "dev") {
        console.log(config.api.platform);
        throw new ForbiddenError("Reset endpoint is only available in development environment");
    }

    config.api.fileServerHits = 0;
    await resetAllUsers();
    res.send("OK");
};