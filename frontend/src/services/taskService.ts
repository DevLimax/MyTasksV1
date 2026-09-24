import api from '@/lib/api'
import type { Task, ListTaskOutput, CreateTaskDto, UpdateTaskDto, Priority, Status } from '@/types/task'

export interface TaskFilters {
  userId?: string
  status?: Status
  priority?: Priority
}

export const taskService = {
  list(filters: TaskFilters = {}) {
    return api.get<ListTaskOutput>('/tasks', { params: filters })
  },

  find(id: string) {
    return api.get<Task>(`/tasks/${id}`)
  },

  create(data: CreateTaskDto) {
    return api.post<Task>('/tasks/create', data)
  },

  update(id: string, data: UpdateTaskDto) {
    return api.put<Task>(`/tasks/${id}`, data)
  },

  delete(id: string) {
    return api.delete(`/tasks/${id}`)
  },
}
