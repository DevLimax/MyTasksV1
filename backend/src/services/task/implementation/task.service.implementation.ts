import { Status } from "@prisma/client";
import Task from "../../../models/entities/task";
import type { TaskFilters, TaskRepository } from "../../../repositories/task/task.repository";
import type { ListTaskOutputDto, TaskInputDto, TaskOutputDto, TaskService, TaskUpdateInputDto } from "../task.service";


export class TaskServiceImplementation implements TaskService {
    private constructor(readonly repository: TaskRepository){}

    public static build(repository: TaskRepository) {
        return new TaskServiceImplementation(repository);
    }

    public async save(task: TaskInputDto): Promise<TaskOutputDto> {
        const {userId, title, description, status, priority} = task;
        const entity = Task.create(userId, title, description, priority, status);
        try{
            const instance = await this.repository.save(entity);
            const output: TaskOutputDto = {
                id: instance.id,
                userId: instance.userId,
                title: instance.title,
                description: instance.description,
                priority: instance.priority,
                status: instance.status,
                created_at: instance.created_at,
                completed_on: instance.completed_on
            }
            return output
        } catch(e: any) {
            throw new Error(e.message);
        }
    }

    public async list(filters: TaskFilters): Promise<ListTaskOutputDto> {
        const tasks = await this.repository.list(filters);
        const output: ListTaskOutputDto = {
            tasks: tasks.map(task => {
                return {
                    id: task.id,
                    userId: task.userId,
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    created_at: task.created_at,
                    completed_on: task.completed_on
                }
            })
        }
        return output
    }

    public async find(id: string): Promise<TaskOutputDto | null> {
        const query = await this.repository.find(id);
        if(!query) {return null};
        const output: TaskOutputDto =  {
            id: query.id,
            userId: query.userId,
            title: query.title,
            description: query.description,
            status: query.status,
            priority: query.priority,
            completed_on: query.completed_on,
            created_at: query.created_at
        }
        return output
    }

    public async update(id: string, data: TaskUpdateInputDto): Promise<TaskOutputDto> {
        const task = await this.repository.find(id);
        if(!task) {
            throw new Error('task not found');
        }
        const taskUpdated = Task.with(
            id, 
            task.userId,
            data.title ?? task.title,
            data.description ?? task.description ?? null,
            data.priority ?? task.priority,
            data.status ?? task.status
        )
        if(taskUpdated.status === Status.completed) {
            taskUpdated.completeTask();
        }
        try{
            await this.repository.update(id, taskUpdated);
            return {
                id: taskUpdated.id,
                userId: taskUpdated.userId,
                title: taskUpdated.title,
                description: taskUpdated.description,
                priority: taskUpdated.priority,
                status: taskUpdated.status,
                created_at: taskUpdated.created_at,
                completed_on: taskUpdated.completed_on
            };
        } catch(e: any) {
            throw new Error(e.message);
        }
    }

    public async delete(id: string): Promise<void> {
        const task = await this.repository.find(id);
        if(!task) {
            throw new Error('task not found');
        }
        try{
            await this.repository.delete(id);
            return
        } catch(e: any) {
            throw new Error(e.message);
        };
    }
};