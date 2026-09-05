import type { NextFunction, Request, Response } from "express";

const errorMiddleware = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
    success: false,
    message: err.message || "Erreur de serveur",
  });
};

export default errorMiddleware