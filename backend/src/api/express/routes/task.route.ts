import { Router } from "express";
import prisma from "../../../repositories/prisma";

import { TaskRepositoryPrisma } from "../../../repositories/task/prisma/task.repository.prisma";
import { TaskServiceImplementation } from "../../../services/task/implementation/task.service.implementation";
import { TaskController } from "../controllers/task.controller";

const aRepository = TaskRepositoryPrisma.build(prisma);
const aService = TaskServiceImplementation.build(aRepository);
const controller = TaskController.build(aService)

const router = Router();


router.get('/', controller.list);
router.get('/:id', controller.find);
router.post('/create', controller.save);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export { router as taskRouter };