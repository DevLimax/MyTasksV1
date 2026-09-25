import { Priority, Status } from "@prisma/client";

export type TaskProps = {
    id: string,
    userId: string,
    title: string,
    description?: string | null,
    priority: Priority
    status: Status,
    created_at?: Date,
    completed_on?: Date | null
}

export default class Task {
    private constructor(private props: TaskProps) {}

    public static create(
        userId: string, 
        title: string, 
        description?: string, 
        priority: Priority = Priority.medium, 
        status: Status = Status.pending
    ) {
        const id = crypto.randomUUID().toString();
        return new Task({
            id,
            userId,
            title,
            description,
            priority,
            status
        })
    }

    public static with(id: string,
                        userId: string,
                        title: string, 
                        description: string | null,
                        priority: Priority, 
                        status: Status, 
                        created_at?: Date, 
                        completed_on?: Date | null
    ) {
        return new Task({
            id,
            userId,
            title,
            description,
            priority,
            status,
            created_at,
            completed_on
        })
    }

    public completeTask() {
        if(this.status != Status.completed) {
            throw new Error(`It is not possible to complete the task with the status: ${this.status}`);
        } else if (this.status === Status.completed) {
            this.props.completed_on = new Date();
            return
        }
    }

    public get id(): string {return this.props.id};
    public get userId(): string {return this.props.userId}
    public get title(): string {return this.props.title};
    public get description(): string | undefined | null {return this.props.description};
    public get priority(): Priority {return this.props.priority};
    public get status(): Status {return this.props.status};
    public get created_at(): Date | undefined {return this.props.created_at};
    public get completed_on(): Date | undefined | null {return this.props.completed_on};
}