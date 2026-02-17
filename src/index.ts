import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { 
    middlewareLogResponse, 
    middlewareMetricsInc,
    } from "./api/middleware.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidateChirp } from "./api/validate.js";
const app = express();
const PORT = 8080


app.use(middlewareLogResponse);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.post("/api/validate_chirp", handlerValidateChirp)
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics",handlerMetrics);
app.post("/admin/reset", handlerReset);



app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

