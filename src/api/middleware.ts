import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError, respondWithJSON } from "./json.js";

export function middlewareLogResponse(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
        if (res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
        }
    }); 
    next();
};

export function middlewareMetricsInc( req: Request, res: Response, next: NextFunction): void {
    config.fileServerHits += 1;
    next();
};

export function middlewareErrorHandler( err: Error, req: Request, res: Response, next: NextFunction) {
    console.log("Error occurred:", err);
    respondWithError(res, 500, "Something went wrong on our end");
};