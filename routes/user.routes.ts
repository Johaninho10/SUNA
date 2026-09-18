import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { profile, updateProfile } from "../controllers/user.controller.js";
import uploadImage from "../lib/multer-images.js";

const userRouter = Router();

userRouter.get("/", authMiddleware, profile);
userRouter.patch(
  "/",
  authMiddleware,
  uploadImage.single("avatar"),
  updateProfile,
);

export default userRouter;
