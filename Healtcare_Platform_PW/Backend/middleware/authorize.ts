import { Request, Response, NextFunction } from "express";
import { authRequest } from "./auth";

export const authorizeRole = (roles : string[]) => {
    return (req: authRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: insufficient privileges" });
    }
    next();
  };
}