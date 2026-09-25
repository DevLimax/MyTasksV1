import type { NextFunction, Request, Response } from "express";
import { userCreateSchema, userLoginSchema } from "../../../models/schemas/user.schemas";

export async function validateFieldUserCreate(req: Request, res: Response, next: NextFunction) {
    const result = userCreateSchema.safeParse(req.body);
    if(!result.success) {
        const message = result.error.issues[0]?.message
        res.status(400).json({message: message}).send();
        return
    }
    next();
}

export async function validateLoginCredentials(req: Request, res: Response, next: NextFunction) {
    const result = userLoginSchema.safeParse(req.body);
    if(!result.success) {
        const message = result.error.issues[0]?.message
        res.status(400).json({message: message}).send();
        return
    }
    next();
}