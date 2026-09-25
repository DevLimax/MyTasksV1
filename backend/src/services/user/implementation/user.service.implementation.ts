import User from "../../../models/entities/user";
import type { UserRepository } from "../../../repositories/user/user.repository";
import Hash from "../../../utils/hash.utils";
import type { ListOutputDto, LoginOutputDto, UserOutputDto, UserService } from "../user.service";


export class UserServiceImplementation implements UserService {

    private constructor(readonly repository: UserRepository){};

    public static build(repository: UserRepository) {
        return new UserServiceImplementation(repository);
    };

    public async save(username: string, email: string, password: string): Promise<UserOutputDto> {
        const aUser = await User.create(username, email, password);
        
        try {
            await this.repository.save(aUser);
            const output: UserOutputDto = {
                id: aUser.id,
                username: aUser.username,
                email: aUser.email,
                lastLogin: aUser.lastLogin
            };
            return output
        } catch(e: any) {
            throw new Error(e.message);
        }
    };

    public async list(): Promise<ListOutputDto> {
        const query = await this.repository.list();
        const users = query.map(user => {
            return {
                id: user.id,
                username: user.username,
                email: user.email,
                lastLogin: user.lastLogin
            }
        });
        const output: ListOutputDto = {
            users: users
        }
        return output
    }

    public async find(id: string, withTasks?: boolean): Promise<UserOutputDto | null> {
        const query = withTasks ? await this.repository.findWithTasks(id) : await this.repository.find(id);
        if(!query) {return null};

        const {username, email, lastLogin, tasks} = query;
        const output: UserOutputDto = {
            id,
            username,
            email,
            lastLogin,
            tasks
        };
        return output
    }

    public async update(id: string, { newUsername, newEmail }: { newUsername?: string; newEmail?: string; }): Promise<UserOutputDto> {
        try{
            const aUser = await this.repository.update(id, {newUsername, newEmail});
            const {username, email, lastLogin} = aUser;
            const output: UserOutputDto = {
                id,
                email,
                username,
                lastLogin
            };
            return output
        } catch(e: any) {
            throw new Error(e.message);
        }
    };

    public async updatePassword(id: string, newPassword: string): Promise<UserOutputDto> {
        try{
            const hashPassword = await Hash.generateHashPassword(newPassword);
            const aUser = await this.repository.update(id, {newPassword: hashPassword});
            const {username, email, lastLogin} = aUser;
            const output: UserOutputDto = {
                id,
                username,
                email,
                lastLogin
            };
            return output
        } catch (e: any) {
            throw new Error(e.message);
        }
    }

    public async delete(id: string): Promise<void> {
        try{
            await this.repository.delete(id);
            return
        } catch(e: any) {
            throw new Error(e.message);
        }
    }

    public async login(email: string, unhashedPassword: string): Promise<LoginOutputDto> {
        const data = await this.repository.find(undefined, email);
        if(!data) {
            throw new Error('user not found with the email provided');
        }
        const {id, username, password} = data;
        const lastLogin = new Date();
        const user = User.with(id, username, email, password, lastLogin);
        
        const checkPassword = await Hash.matchPassword(unhashedPassword, password);
        if(!checkPassword) {
            throw new Error('credentials invalid!');
        }
        this.repository.update(id, {newLastLogin: lastLogin});
        return user.login();
    }
}