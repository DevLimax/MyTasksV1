import type { Priority, Status } from "@prisma/client";
import type Task from "../../models/entities/task";

export type TaskFilters = {
    userId?: string,
    status?: Status,
    priority?: Priority
}

export interface TaskRepository {
    save(task: Task): Promise<Task>;
    list(filters: TaskFilters ): Promise<Task[]>;
    find(id: string): Promise<Task | null>;
    update(id: string, task: Task): Promise<Task>;
    delete(id: string): Promise<void>;
}