import type { Request, Response, NextFunction } from "express";
import { User } from "../generated/prisma/client.js";
import asyncHandler from "express-async-handler";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password">;
    }
  }
}

export const adminMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    if (!user) {
      res.status(400);
      throw new Error();
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      res.status(403);
      throw new Error(
        "Vous devez etre un administrateur pour éffectuer cette opération",
      );
    }

    next();
  },
);

export default adminMiddleware;
