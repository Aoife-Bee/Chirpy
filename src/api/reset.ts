import type { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerReset( req: Request, res: Response) {
    config.api.fileServerHits = 0;
    res.send("OK");
};