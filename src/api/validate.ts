import type { Request, Response } from "express";

export function handlerValidateChirp( req: Request, res: Response) {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        try {
            const parsedBody = JSON.parse(body);
            if (typeof parsedBody.body !== "string") {
                res.status(400).json({ error: "Chirp must be a string" });
                return;
            }

            if (parsedBody.body.trim() === "") {
                res.status(400).json({ error: "Chirp cannot be empty" });
                return;
            }

            if (parsedBody.body.length > 140) {
                res.status(400).json({ error: "Chirp is too long" });
                return;
            }

            res.status(200).json({ valid: true });

        } catch (error) {
            res.status(400).json({ error: "Invalid JSON" });

        }
    });
}