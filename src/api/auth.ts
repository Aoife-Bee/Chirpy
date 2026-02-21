import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { UnauthorizedError } from "./errors.js";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../auth.js";
import { createRefreshToken, findRefreshToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";
import { config } from "../config.js";

export async function handlerLogin( req: Request, res: Response ) {
    const user = await getUserByEmail(req.body.email);
    if (!user) {
        throw new UnauthorizedError("Incorrect email or password");
    }

    const valid = await checkPasswordHash( req.body.password, user.hashedPassword);
    
    if (valid === true) {
        const token = makeJWT(user.id, 3600, config.jwt.secret)
        const refreshToken = makeRefreshToken()
        await createRefreshToken({
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        })

        respondWithJSON(res, 200, {
        id: user.id, 
        createdAt: user.createdAt, 
        updatedAt: user.updatedAt,
        email: user.email, 
        token: token,
        refreshToken: refreshToken,
        }
        );
    }
    else {
        throw new UnauthorizedError("Incorrect email or password");
    }
};

export async function handlerRefresh( req: Request, res: Response ) {
    const token = getBearerToken(req);
    const refreshToken = await findRefreshToken(token);
    respondWithJSON(res, 200, {
        token: makeJWT(refreshToken.userId, 3600, config.jwt.secret),
    });
}

export async function handlerRevoke( req: Request, res: Response ) {
    const token = getBearerToken(req);
    await revokeRefreshToken(token);
    res.sendStatus(204);
}