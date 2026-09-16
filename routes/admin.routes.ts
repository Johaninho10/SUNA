import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {
  createService,
  deleteService,
  getServices,
  updateService,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.get("/service", authMiddleware, adminMiddleware, getServices);
adminRouter.post("/service", authMiddleware, adminMiddleware, createService);
adminRouter.patch(
  "/service/:id",
  authMiddleware,
  adminMiddleware,
  updateService,
);
adminRouter.delete(
  "/service/:id",
  authMiddleware,
  adminMiddleware,
  deleteService,
);

export default adminRouter;
