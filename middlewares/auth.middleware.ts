import type { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../lib/prisma.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import validator from "validator";
import { User } from "../generated/prisma/client.js";

interface AuthPayload extends JwtPayload {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password">;
    }
  }
}

const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { auth_token } = req.cookies;

    if (!auth_token) {
      res.status(401);
      throw new Error("Veuillez-vous connecter");
    }

    const { userId } = jwt.verify(
      auth_token,
      String(process.env.JWT_SECRET_KEY),
    ) as AuthPayload;

    if (!validator.isUUID(userId)) {
      res.status(400);
      throw new Error("Identifiant invalide");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      res.status(404);
      throw new Error("Utilisateur non trouvé");
    }

    req.user = user;

    next()
  },
);

export default authMiddleware;
