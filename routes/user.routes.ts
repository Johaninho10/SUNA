import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { profile, updateProfile } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", authMiddleware, profile);
userRouter.patch("/", authMiddleware, updateProfile);

export default userRouter;
