import type { Request, Response } from "express";

import { userUpdateSchema } from "../../../models/schemas/user.schemas";
import { exportPayload } from "../../../utils/token.utils";
import type { UserService } from "../../../services/user/user.service";

export class UserController {
    private constructor(private service: UserService) {};

    public static build(service: UserService) {
        return new UserController(service);
    };

    public save = async (req: Request, res: Response) => {
        const {username, email, password} = req.body;
        try {
            const output = await this.service.save(username, email, password);
            const data = {
                id: output.id,
                username,
                email,
                lastLogin: output.lastLogin
            }
            res.status(201).json(data).send();
        } catch (e: any) {
            res.status(400).json({message: e.message}).send();
        }
    }

    public list = async (req: Request, res: Response) => {
        const output = await this.service.list();
        const data = {
            users: output.users
        };
        res.status(200).json(data).send();
    }

    public find = async (req: Request, res: Response) => {
        const {id} = req.params;
        const {withTasks} = req.query;
        const output = typeof id === 'string' ? await this.service.find(id, withTasks === 'true') : null;
        if(!output) {
            res.status(404).send(`user not found`);
            return
        }
        const data = {
            id: id,
            username: output?.username,
            email: output?.email,
            lastLogin: output?.lastLogin,
            tasks: output?.tasks?.map(task => {
                return {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    created_at: task.created_at,
                    completed_on: task.completed_on
                }
            })
        }
        res.status(200).json(data).send();
    }

    public updatePassword = async (req: Request, res: Response) => {
        const {id}: any = exportPayload(req.headers['authorization']?.split(' ')[1] || '');
        if(typeof id != 'string') return res.status(400).send('Invalid ID');
        
        const validator = userUpdateSchema.safeParse(req.body);
        if(!validator.success) {
            const message = validator.error.issues[0]?.message
            res.status(400).json({message: message}).send();
            return
        }

        const {password} = validator.data;
        if(!password) {
            res.status(400).send('new password is required')
            return
        }
        try{
            const user = await this.service.updatePassword(id, password);
            res.status(200).json(user);
        } catch (e: any) {
            res.status(500).json({message: e.message});
        }
    }

    public edit = async (req: Request, res: Response) => {
        const {id}: any = exportPayload(req.headers['authorization']?.split(' ')[1] || '');
        if(typeof id != 'string') return res.status(400).send('Invalid ID');

        const validator = userUpdateSchema.safeParse(req.body);
        if(!validator.success) {
            const message = validator.error.issues[0]?.message
            res.status(400).json({message: message}).send();
            return
        }

        const {username, email} = validator.data;
        try {
            const user = await this.service.update(id, {newUsername: username, newEmail: email});
            res.status(200).json(user).send();
        } catch (e: any) {
            res.status(500).json({message: e.message});
        };
    }

    public delete = async (req: Request, res: Response) => {
        const {id} = req.params;
        if(typeof id != 'string') {
            res.status(400).send('invalid ID')
            return
        }

        const aUser = await this.service.find(id);

        if(!aUser) {
            res.status(404).send("user not found");
            return
        }

        try{
            await this.service.delete(id);
            res.status(204).send();
        } catch(e: any) {
            res.status(400).json({message: e.message});
        }
    }

    public login = async (req: Request, res: Response) => {
        const {email, password} = req.body;
        try{
            const output = await this.service.login(email, password);
            res.status(201).json(output);
        } catch(e: any) {
            res.status(400).json({message: e.message});
        };
    }
}
