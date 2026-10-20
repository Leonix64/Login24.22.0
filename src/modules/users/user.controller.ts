import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error.js";
import { findById, toPublicUser } from "./user.service.js";

export async function getMeHandler(req: Request, res: Response) {
    const userId = req.auth?.userId;
    if (!userId) throw new AppError(401, "No authenticated", "MISSING_TOKEN");

    // The token can be valid while the user was deleted in the meantime
    const user = await findById(userId);
    if (!user) throw new AppError(404, "User not found", "USER_NOT_FOUND");

    res.json({ user: toPublicUser(user) });
}