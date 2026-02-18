import type { Request, Response } from "express";
import { createChirp, getChirps, getChirpById } from "../db/queries/chirps.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError, NotFoundError } from "./errors.js";


export async function handlerGetChirps(_: Request, res: Response) {
    const chirps = await getChirps();
    respondWithJSON(res, 200, chirps);
};

export async function handlerGetChirpById(req: Request, res: Response) {
    const { chirpId } = req.params

    if (typeof chirpId !== "string") {
        throw new BadRequestError("Invalid chirp ID");
    }

    const chirp = await getChirpById(chirpId);
    if (!chirp) {
        throw new NotFoundError("Chirp not found");
    }
    respondWithJSON(res, 200, chirp);
}

export async function handlerCreateChirp( req: Request, res: Response) {
    type parameters = { body: string, userId: string };

    const params: parameters = req.body;
    const maxChirpLength = 140;

    if (!params.body) {
        throw new BadRequestError("Missing required fields: body");
    }
    if (!params.userId) {
        throw new BadRequestError("Missing required fields: userId");
    }

    if (params.body.length > maxChirpLength) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const cleaned = badWordReplacer(params.body);

    const chirp = await createChirp({ body: cleaned, userId: params.userId });

    if (!chirp) {
        throw new Error("Could not create chirp");
    }
    respondWithJSON(res, 201,{
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.userId
    });
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