import type { Request, Response } from "express";
import * as authService from "./auth.service.js";

export async function registerHandler(req: Request, res: Response) {
    const result = await authService.register(req.body);
    res.status(201).json(result);
}

export async function loginHandler(req: Request, res: Response) {
    const result = await authService.login(req.body);
    res.json(result);
}
