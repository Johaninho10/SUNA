import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import asyncHandler from "express-async-handler";
import validator from "validator";

export const getServices = asyncHandler(async (req: Request, res: Response) => {
  const services = await prisma.service.findMany();

  res.status(200).json({
    success: true,
    data: services,
    meta: {
      total: services.length,
    },
  });
});

export const createService = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      slug,
      title,
      description,
      icon,
      display_order,
    }: {
      slug: string;
      title: string;
      description: string;
      icon: string;
      display_order: number;
    } = req.body;

    if (!slug || !slug.trim()) {
      res.status(400);
      throw new Error("Le slug est requis");
    }

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error("Le titre est requis");
    }

    if (!description || !description.trim()) {
      res.status(400);
      throw new Error("La description est requise");
    }

    if (display_order === undefined) {
      res.status(400);
      throw new Error("L'ordre d'affichage est requis");
    }

    if (isNaN(display_order)) {
      res.status(400);
      throw new Error("L'ordre d'affichage doit etre un nombre");
    }

    if (display_order <= 0) {
      res.status(400);
      throw new Error("L'ordre d'affichage doit etre strictement positif");
    }

    if (parseInt(String(display_order)) !== display_order) {
      res.status(400);
      throw new Error("L'ordre d'affichage doit etre un entier");
    }

    const data: {
      slug: string;
      title: string;
      description: string;
      icon?: string;
      display_order: number;
    } = {
      slug: slug.trim(),
      title: title.trim(),
      description: description.trim(),
      display_order,
    };

    if (icon.trim()) {
      data.icon = icon.trim();
    }

    const service = await prisma.service.create({
      data,
    });

    res.status(201).json({
      success: true,
      message: "Service créé avec succès",
      service,
    });
  },
);

export const updateService = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const {
      slug,
      title,
      description,
      icon,
      is_active,
      display_order,
    }: {
      slug: string;
      title: string;
      description: string;
      icon: string;
      is_active: Boolean;
      display_order: number;
    } = req.body;

    const data: any = {};

    if (slug) {
      if (!slug.trim()) {
        res.status(400);
        throw new Error("Le slug est requis");
      }
      data.slug = slug;
    }

    if (title) {
      if (!title.trim()) {
        res.status(400);
        throw new Error("Le titre est requis");
      }
      data.title = title;
    }

    if (description) {
      if (!description.trim()) {
        res.status(400);
        throw new Error("La description est requise");
      }
      data.description = description;
    }

    if (icon) {
      if (!icon.trim()) {
        res.status(400);
        throw new Error("L'icone est requise");
      }
      data.icon = icon;
    }

    if (is_active !== undefined) {
      if (typeof is_active !== "boolean") {
        res.status(400);
        throw new Error('Le champ "is_active" doit etre un booléen');
      }
      data.is_active = is_active;
    }

    if (display_order) {
      if (isNaN(display_order)) {
        res.status(400);
        throw new Error("L'ordre d'affichage doit etre un nombre");
      }

      if (display_order <= 0) {
        res.status(400);
        throw new Error("L'ordre d'affichage doit etre strictement positif");
      }

      if (parseInt(String(display_order)) !== display_order) {
        res.status(400);
        throw new Error("L'ordre d'affichage doit etre un entier");
      }
      data.display_order = display_order;
    }

    if (!validator.isUUID(String(id))) {
      res.status(400);
      throw new Error("Identifiant de service invalide");
    }

    const service = await prisma.service.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!service) {
      res.status(404);
      throw new Error("Service non trouvé");
    }

    const newService = await prisma.service.update({
      where: {
        id: String(id),
      },
      data,
    });

    res.status(200).json({
      success: true,
      message: "Service modifié avec succès",
      service: newService,
    });
  },
);

export const deleteService = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!validator.isUUID(String(id))) {
      res.status(400);
      throw new Error("Identifiant invalide");
    }

    const service = await prisma.service.findUnique({
      where: {
        id: String(id),
      },
    });

    if (!service) {
      res.status(404);
      throw new Error("Service non trouvé");
    }

    await prisma.service.delete({
      where: {
        id: String(id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Service supprimé avec succès",
    });
  },
);
