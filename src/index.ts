import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { handlerReadiness } from "./api/readiness.js";
import { 
    middlewareLogResponse, 
    middlewareMetricsInc,
    middlewareErrorHandler
    } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerCreateChirp, handlerGetChirps, handlerGetChirpById, handlerDeleteChirp } from "./api/chirps.js";
import { handlerCreateUser, handlerUpdateUser } from "./api/users.js";
import { handlerLogin, handlerRefresh, handlerRevoke } from "./api/auth.js";
import { config } from "./config.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();


app.use(middlewareLogResponse);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", async (req, res, next) => {
    try {
       await handlerReadiness(req, res);
    } catch (err) {
        next(err);
    }
});

app.get("/admin/metrics", async (req, res, next) => {
    try {
        await handlerMetrics(req, res);
    } catch (err) {
        next(err);
    }
});

app.post("/admin/reset", async (req, res, next) => {
    try {
        await handlerReset(req, res);
    } catch (err) {
        next(err);
    }
});

app.get("/api/chirps", async (req, res, next) => {
    try {
        await handlerGetChirps (req, res); 
    } catch (err) {
        next(err);
    }
});

app.get("/api/chirps/:chirpId", async (req, res, next) => {
    try {
        await handlerGetChirpById(req, res);
    } catch (err) {
        next(err);
    }
});

app.post("/api/chirps", async (req, res, next) => {
    try {
        await handlerCreateChirp(req, res);
    } catch (err) {
        next(err);
    }
});

app.delete("/api/chirps/:chirpId", async (req, res, next) => {
    try {
        await handlerDeleteChirp(req, res);
    } catch (err) {
        next(err);
    }
});

app.post("/api/users", async (req, res, next) => { 
    try {
        await handlerCreateUser(req, res);
    } catch (err) {
        next(err);
    }
});

app.post("/api/login", async (req, res, next) => {
    try {
        await handlerLogin(req, res);
    } catch(err) {
        next(err);
    }
});

app.post("/api/refresh", async (req, res, next) => {
    try {
        await handlerRefresh(req, res);
    } catch(err) {
        next(err);
    }
});

app.post("/api/revoke", async (req, res, next) => {
    try {
        await handlerRevoke(req, res);
    } catch(err) {
        next(err);
    }
});

app.put("/api/users", async (req, res, next) => {
    try {
        await handlerUpdateUser(req, res);
    } catch(err) {
        next(err);
    }
});


app.use(middlewareErrorHandler);

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});

