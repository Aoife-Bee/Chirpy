import type { Request, Response } from "express";
import { respondWithJSON,respondWithError } from "./json.js";

export function handlerValidateChirp( req: Request, res: Response) {
    type parameters = { body: string };

    const params: parameters = req.body;
    const maxChirpLength = 140;

    if (params.body.length > maxChirpLength) {
        respondWithError(res, 400, "Chirp is too long");
        return;
    }
    const cleaned = badWordReplacer(params.body);

    respondWithJSON(res, 200, {cleanedBody: cleaned});
}


function badWordReplacer(string: string): string {
    const badWords = ["kerfuffle", "sharbert", "fornax"];

    const words = string.split(" ");

    for (let i = 0; i < words.length; i++) {
        if (badWords.includes(words[i].toLowerCase())) {
            words[i] = "****";
        }
    }
    return words.join(" ");
}