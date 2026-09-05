import { Router } from "express";
import uploadImages from "../lib/multer-images.js";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", uploadImages.single("avatar"), signUp);
authRouter.post("/signin", signIn);
authRouter.post("/signout", signOut);

export default authRouter;
