import type {PrismaClient} from "@prisma/client";

import User from "../../../models/entities/user"; 
import type { UserRepository, UserUpdateInput } from "../user.repository";

export class UserRepositoryPrisma implements UserRepository {
    private constructor (readonly repository: PrismaClient) {};

    public static build(prisma: PrismaClient) {
        return new UserRepositoryPrisma(prisma);
    }

    public async save(user: User): Promise<User> {
        const data = {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password
        }

        try {
            const instance = await this.repository.user.create({data});
            const {id, username, email, password, last_login } = instance;
            const aUser = User.with(id, username, email, password, last_login);
            return aUser
        } catch (e: any) {
            if(e.message.includes('username')) {
                throw new Error('username in use');
            } else if (e.message.includes('email')) {
                throw new Error('email in use');
            } else {
                throw new Error(e.messsage);
            }
        };
    }
    
    public async list(): Promise<User[]> {
        const query = await this.repository.user.findMany();
        const users = query.map(user => {
            const {id, username, email, password, last_login} = user;
            return User.with(id, username, email, password, last_login)
        })
        return users;
    }

    public async update(id: string, data: UserUpdateInput): Promise<User> {
        const aUser = await this.repository.user.findUnique({where: {id: id}});
        if(!aUser) {throw new Error('user not found')};

        aUser.username = data.newUsername ?? aUser.username;
        aUser.email = data.newEmail ?? aUser.email;
        aUser.password = data.newPassword ?? aUser.password;
        aUser.last_login = data.newLastLogin ?? aUser.last_login;

        const {username, email, password, last_login} = await this.repository.user.update({where: {id: id}, data: {...aUser}});
        const user = User.with(id, username, email, password, last_login);
        return user
    }

    public async find(id?: string, email?: string): Promise<User | null> {
        if(id) {
            const query = await this.repository.user.findUnique({where: {id: id}});
            if(!query) {return null};
    
            const {username, email, password, last_login} = query;
            const user = User.with(id, username, email, password, last_login);
            return user
        } else if (email) {
            const query = await this.repository.user.findUnique({where: {email: email}});
            if(!query) {return null};
    
            const {id, username, password, last_login} = query;
            const user = User.with(id, username, email, password, last_login);
            return user
        } else {
            return null
        }
    }

    public async findWithTasks(id: string): Promise<User | null> {
        const query = await this.repository.user.findUnique({where: {id: id}, include: {tasks: true}});
        if(!query) {return null};

        const {username, email, password, last_login, tasks} = query;
        const user = User.with(id, username, email, password, last_login, tasks);
        return user
    }

    public async delete(id: string): Promise<void> {
        const query = await this.repository.user.findUnique({where: {id: id}});
        if(!query) {throw new Error('user not found')};
        await this.repository.user.delete({where: {id: id}});
        return
    }
}