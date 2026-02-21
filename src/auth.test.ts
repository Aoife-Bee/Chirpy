import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./auth";
import { UnauthorizedError } from "./api/errors";

describe("JWT Functions", () => {
    const userID = "123-abc";
    const secret = "secret";
    let validToken: string

    beforeAll( () => {
        validToken = makeJWT(userID, 1000, secret)
    });

    it("should return userID if valid", () => {
        expect(validateJWT(validToken, secret)).toBe(userID);
    });

    it("should reject if signed with the wrong secret", () => {
        expect(() => validateJWT(validToken, "wrong secret")).toThrow(UnauthorizedError);
    });

    it("should reject expired tokens", () => {
        const expired = makeJWT(userID, -1, secret);
        expect(() => validateJWT(expired, secret)).toThrow(UnauthorizedError);
    });

    it("should reject invalid token string", () => {
        expect(() => validateJWT("invalid token string", secret)).toThrow(UnauthorizedError)
    })
});