import { Router } from "express";
import { validateBody } from "../../shared/middleware/validate.js";
import { authLimiter } from "../../shared/middleware/rate-limit.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import { loginHandler, registerHandler } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", authLimiter, validateBody(registerSchema), registerHandler);
authRouter.post("/login", authLimiter, validateBody(loginSchema), loginHandler);
