import type { NextFunction, Request, Response } from "express";
import prisma from "../../../repositories/prisma";
import { UserRepositoryPrisma } from "../../../repositories/user/prisma/user.repository.prisma";
import { exportPayload } from "../../../utils/token.utils";

export async function checkTokenValid(req: Request, res: Response, next: NextFunction) {
    const repository = UserRepositoryPrisma.build(prisma);
    const authToken = req.headers['authorization']?.split(' ')[1];
    if(!authToken) {
        res.status(401).send("you need to log in to perform this action.")
        return
    }
    try {
        const payload: any = exportPayload(authToken);
        const result = await repository.find(payload['id']);
        if(!result) {
            res.status(401).send("invalid token")
            return
        }
    } catch (e: any) {
        res.status(401).send(e.message)
        return
    }
    next();
}