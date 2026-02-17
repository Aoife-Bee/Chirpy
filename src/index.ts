import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { 
    middlewareLogResponse, 
    middlewareMetricsInc,
    middlewareErrorHandler
    } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidateChirp } from "./api/chirps.js";


const app = express();
const PORT = 8080


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

app.post("/api/validate_chirp", async (req, res, next) => {
    try {
        await handlerValidateChirp(req, res);
    } catch (err) {
        next(err);
    }
});

app.use(middlewareErrorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

