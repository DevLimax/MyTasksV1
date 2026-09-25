import type { Priority, Status } from "@prisma/client"
import type { TaskFilters } from "../../repositories/task/task.repository"

export type TaskInputDto = {
    userId: string
    title: string,
    description?: string,
    status?: Status,
    priority?: Priority
} 

export type TaskOutputDto = {
    id: string,
    userId: string,
    title: string,
    description?: string | null,
    status: Status,
    priority: Priority,
    created_at?: Date,
    completed_on?: Date | null
}

export type ListTaskOutputDto = {
    tasks: TaskOutputDto[]
}

export type TaskUpdateInputDto = {
    title?: string,
    description?: string,
    status?: Status,
    priority?: Priority
}

export interface TaskService {
    save(task: TaskInputDto): Promise<TaskOutputDto>;
    list(filters: TaskFilters): Promise<ListTaskOutputDto>;
    find(id: string): Promise<TaskOutputDto | null>;
    update(id: string, data: TaskUpdateInputDto): Promise<TaskOutputDto>;
    delete(id: string): Promise<void>;
}