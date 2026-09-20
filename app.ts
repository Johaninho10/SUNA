import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import authRouter from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    res.send("API Working");
  }),
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use(errorMiddleware);

if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
