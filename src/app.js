import express from "express";
import cors from "cors";

import uploadRoute from "./routes/upload.js";

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => res.send("API running ✅"));

//upload route(REST)
app.use("/upload", uploadRoute);

export default app;