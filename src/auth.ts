import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "./api/errors.js";
import crypto from "crypto";

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

export function getBearerToken(req: Request): string {
    if (!req.header) {
        throw new UnauthorizedError("No authorization header");
    }
    const token = req.get("Authorization");

    if (!token) {
        throw new UnauthorizedError("No authorization token");
    }

    const cleanToken = token.replace(/^Bearer\s+/i, "").trim();
    if (!cleanToken) {
        throw new UnauthorizedError("Malformed authorization header")
    }
    return cleanToken
}

export function makeRefreshToken() {
    return crypto.randomBytes(32).toString("hex");
}