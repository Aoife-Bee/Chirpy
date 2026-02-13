import type { Request, Response } from "express";
import { config } from "../config.js";

export function handlerMetrics( req: Request, res: Response) {
    res.type("text/plain");
    res.send(`Hits: ${config.fileServerHits}`);
};