import { Router } from "express";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { getMeHandler } from "./user.controller.js";

export const userRouter = Router();

userRouter.get("/me", authenticate, getMeHandler);
