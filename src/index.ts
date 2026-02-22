import express, { type Request, type Response, type NextFunction } from "express";
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
import { handlerWebhooks } from "./api/webhooks.js";

const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res)).catch(next);

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();


app.use(middlewareLogResponse);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", asyncHandler(handlerReadiness));
app.get("/admin/metrics", asyncHandler(handlerMetrics));
app.post("/admin/reset", asyncHandler(handlerReset));

app.get("/api/chirps", asyncHandler(handlerGetChirps));
app.get("/api/chirps/:chirpId", asyncHandler(handlerGetChirpById));
app.post("/api/chirps", asyncHandler(handlerCreateChirp));
app.delete("/api/chirps/:chirpId", asyncHandler(handlerDeleteChirp));

app.post("/api/users", asyncHandler(handlerCreateUser));
app.put("/api/users", asyncHandler(handlerUpdateUser));

app.post("/api/login", asyncHandler(handlerLogin));
app.post("/api/refresh", asyncHandler(handlerRefresh));
app.post("/api/revoke", asyncHandler(handlerRevoke));

app.post("/api/polka/webhooks", asyncHandler(handlerWebhooks));


app.use(middlewareErrorHandler);

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});

