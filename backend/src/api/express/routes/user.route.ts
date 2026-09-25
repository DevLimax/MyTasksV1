import prisma from "../../../repositories/prisma";

import { Router } from "express";
import { validateFieldUserCreate } from "../middlewares/user.middleware";
import { checkTokenValid } from "../middlewares/token.middleware";

import { UserController } from "../controllers/user.controller";
import { UserRepositoryPrisma } from "../../../repositories/user/prisma/user.repository.prisma";
import { UserServiceImplementation } from "../../../services/user/implementation/user.service.implementation";


const aRepository = UserRepositoryPrisma.build(prisma);
const aService = UserServiceImplementation.build(aRepository);
const controller = UserController.build(aService);

const router = Router();
router.post('/create', validateFieldUserCreate,  controller.save);
router.post('/login', controller.login);
router.get('/', controller.list);
router.get('/:id', controller.find);
router.put('/', checkTokenValid, controller.edit);
router.put('/updatePassword/', checkTokenValid, controller.updatePassword);
router.delete('/:id', controller.delete);

export {router as userRouter}