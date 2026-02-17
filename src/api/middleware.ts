import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from "./errors.js";

export function middlewareLogResponse(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
        if (res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
        }
    }); 
    next();
};

export function middlewareMetricsInc( req: Request, res: Response, next: NextFunction): void {
    config.api.fileServerHits += 1;
    next();
};

export function middlewareErrorHandler( err: Error, req: Request, res: Response, next: NextFunction) {
    
    if (err instanceof BadRequestError) {
        respondWithError(res, 400, err.message);
    } else if (err instanceof UnauthorizedError) {
        respondWithError(res, 401, err.message);
    } else if (err instanceof ForbiddenError) {
        respondWithError(res, 403, err.message);
    } else if (err instanceof NotFoundError) {
        respondWithError(res, 404, err.message);
    } else {
        console.log(err.message);
        respondWithError(res, 500, "Something went wrong on our end");
    }
};