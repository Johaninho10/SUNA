import type { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma.js";
import asyncHandler from "express-async-handler";
import { User } from "../generated/prisma/client.js";
import validator from "validator";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password">;
    }
  }
}

export const profile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    if (!user) {
      res.status(400);
      throw new Error();
    }

    res.status(200).json({
      success: true,
      user,
    });
  },
);

export const updateProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      full_name,
      email,
      phone,
      country,
      city,
    }: {
      full_name?: string;
      email?: string;
      phone?: string;
      country?: string;
      city?: string;
    } = req.body;

    const data: {
      full_name?: string;
      email?: string;
      phone?: string;
      country?: string;
      city?: string;
    } = {};

    if (full_name) {
      if (!full_name.trim()) {
        res.status(400);
        throw new Error("Le nom complet est requis");
      }
      data.full_name = full_name.trim();
    }

    if (email) {
      if (!email.trim()) {
        res.status(400);
        throw new Error("L'adresse mail est requise");
      }
      if (!validator.isEmail(email)) {
        res.status(400);
        throw new Error("Email invalide");
      }
      data.email = email.trim();
    }

    if (phone) {
      if (!phone.trim()) {
        res.status(400);
        throw new Error("Le numéro de téléphone est requis");
      }
      data.phone = phone.trim();
    }

    if (country) {
      if (!country.trim()) {
        res.status(400);
        throw new Error("Le pays est requis");
      }
      data.country = country.trim();
    }

    if (city) {
      if (!city.trim()) {
        res.status(400);
        throw new Error("La ville est requise");
      }
      data.city = city.trim();
    }

    const { user } = req;

    if (!user) {
      throw new Error();
    }

    const newUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data,
      omit: {
        password: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profil modifé avec succès",
      user: newUser,
    });
  },
);
