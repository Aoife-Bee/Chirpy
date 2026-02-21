import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "./api/errors";

const TOKEN_ISSUER = "chirpy";

export async function hashPassword(password:string): Promise<string> {
    const hashed = await argon2.hash(password);
    return hashed;
};

export async function checkPasswordHash(password:string, hash: string): Promise<boolean> {
    const valid = await argon2.verify(hash, password);
    return valid
};

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + expiresIn;

    const payload: payload = {
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: issuedAt,
        exp: expiresAt,
    };

    return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    let decoded: payload;
    
    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (e) {
        throw new UnauthorizedError("Invalid token");
    }

    if (decoded.iss !== TOKEN_ISSUER) {
        throw new UnauthorizedError("Invalid issuer");
    }

    if (!decoded.sub) {
        throw new UnauthorizedError("No user ID in token");
    }

    return decoded.sub;
}