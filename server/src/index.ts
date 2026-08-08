import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pocketsRouter } from "./routes/pockets.js";
import { transactionsRouter } from "./routes/transactions.js";
import { authRouter } from "./routes/auth.js";

const app = express();
const port = process.env.PORT ?? 3001;
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/pockets", pocketsRouter);
app.use("/api/transactions", transactionsRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
