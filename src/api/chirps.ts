import type { Request, Response } from "express";
import { respondWithJSON,respondWithError } from "./json.js";
import { BadRequestError } from "./errors.js";


export async function handlerValidateChirp( req: Request, res: Response) {
    type parameters = { body: string };

    const params: parameters = req.body;
    const maxChirpLength = 140;

    if (params.body.length > maxChirpLength) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
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