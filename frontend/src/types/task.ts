export type Priority = 'low' | 'medium' | 'high' | 'veryHigh'
export type Status = 'pending' | 'in_progress' | 'delayed' | 'completed'

export interface Task {
  id: string
  userId: string
  title: string
  description?: string | null
  priority: Priority
  status: Status
  created_at?: string
  completed_on?: string | null
}

export interface ListTaskOutput {
  tasks: Task[]
}

export interface CreateTaskDto {
  title: string
  description?: string
  priority?: Priority
  status?: Status
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  priority?: Priority
  status?: Status
}
