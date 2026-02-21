import { UnauthorizedError } from "../../api/errors.js";
import { db } from "../index.js"
import { NewRefreshToken, refreshTokens } from "../schema.js";
import { eq } from  "drizzle-orm"

export async function createRefreshToken(refreshToken: NewRefreshToken) {
    const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .returning();

    return result;
}

export async function findRefreshToken(token: string) {
    const [result] = await db.select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token))
    .limit(1);
    
    if (!result) {
        throw new UnauthorizedError("No valid token")
    }
    if (result.expiresAt < new Date()) {
        throw new UnauthorizedError("Expired token")
    } 
    if (result.revokedAt) {
        throw new UnauthorizedError("Token revoked")
    }

    return result;
}

export async function revokeRefreshToken(token: string) {
    await db.update(refreshTokens)
    .set({ revokedAt: new Date(Date.now()) , updatedAt: new Date(Date.now()) })
    .where(eq(refreshTokens.token, token))
}