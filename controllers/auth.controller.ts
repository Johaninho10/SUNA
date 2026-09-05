import asyncHandler from "express-async-handler";
import type { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import cloudinary from "../lib/cloudinary.js";
import jwt from "jsonwebtoken";

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const {
    full_name,
    email,
    password,
    phone,
    country,
    city,
  }: {
    full_name: string;
    email: string;
    password: string;
    phone: string;
    country: string;
    city: string;
  } = req.body;

  const file = req.file;

  if (!full_name || !full_name.trim()) {
    res.status(400);
    throw new Error("Le nom est requis");
  }

  if (!email || !email.trim()) {
    res.status(400);
    throw new Error("L'email est requis");
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Format d'email invalide");
  }

  if (!password || !password.trim()) {
    res.status(400);
    throw new Error("Le mot de passe est requis");
  }

  if (password.trim().length < 8) {
    res.status(400);
    throw new Error("Le mot de passe doit contenir au moins 8 caractères");
  }

  if (!phone || !phone.trim()) {
    res.status(400);
    throw new Error("Le numéro de téléphone est requis");
  }

  if(!validator.isMobilePhone(phone.trim())){
    throw new Error("Format de numéro de téléphone incorrect")
  }

  if (!country || !country.trim()) {
    res.status(400);
    throw new Error("Le pays est requis");
  }

  if (!city || !city.trim()) {
    res.status(400);
    throw new Error("La ville est requise");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email.trim(),
    },
  });

  if (existingUser) {
    res.status(409);
    throw new Error("Un utilisateur avec cette adresse mail existe déja");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let avatar_url: string | undefined;

  if (file) {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      folder: "avatars",
    });
    avatar_url = result.secure_url;
  }

  const data: any = {
    full_name: full_name.trim(),
    email: email.trim(),
    password: hashedPassword,
    phone: phone.trim(),
    country: country.trim(),
    city: city.trim(),
  };

  if (avatar_url) {
    data.avatar_url = avatar_url;
  }

  await prisma.user.create({
    data,
  });

  res.status(201).json({
    success: true,
    message: "Inscription réussie",
  });
});

export const signIn = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !email.trim()) {
    res.status(400)
    throw new Error("L'email est requise");
  }

  if (!password || !password.trim()) {
    res.status(400)
    throw new Error("L'email est requise");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email.trim(),
    },
  });

  if (!existingUser) {
    res.status(404);
    throw new Error("Utilisateur non trouvé");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    existingUser.password,
  );

  if (!isPasswordCorrect) {
    res.status(401);
    throw new Error("Email ou mot de passe incorrect");
  }

  const auth_token = jwt.sign(
    { userId: existingUser.id },
    String(process.env.JWT_SECRET_KEY),
    { expiresIn: "7d" },
  );

  const { password: pass, ...user } = existingUser;

  res
    .status(200)
    .cookie("auth_token", auth_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message: "Connexion réussie",
      user,
    });
});

export const signOut = asyncHandler(async (req: Request, res: Response) => {
  res
    .clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "PRODUCTION",
      sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
    })
    .status(200)
    .json({
      success: true,
      message: "Deconnexion réussie",
    });
});
