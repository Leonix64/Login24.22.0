import type { Request, Response } from "express";
import { env } from "../../config/env.js";
import * as authService from "./auth.service.js";

const REFRESH_COOKIE = "refresh_token";

const baseCookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/api/auth",
};

function setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE, token, {
        ...baseCookieOptions,
        maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    });
}

const readRefreshCookie = (req: Request): string | undefined => req.cookies?.[REFRESH_COOKIE];

export async function registerHandler(req: Request, res: Response) {
    const { refreshToken, ...body } = await authService.register(req.body);
    setRefreshCookie(res, refreshToken);
    res.status(201).json(body);
}

export async function loginHandler(req: Request, res: Response) {
    const { refreshToken, ...body } = await authService.login(req.body);
    setRefreshCookie(res, refreshToken);
    res.json(body);
}

export async function refreshHandler(req: Request, res: Response) {
    const { refreshToken, ...body } = await authService.refresh(readRefreshCookie(req));
    setRefreshCookie(res, refreshToken);
    res.json(body);
}

export async function logoutHandler(req: Request, res: Response) {
    await authService.logout(readRefreshCookie(req));
    res.clearCookie(REFRESH_COOKIE, baseCookieOptions);
    res.status(204).end();
}
