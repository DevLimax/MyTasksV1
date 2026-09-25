import type { LoginOutputDto } from "../../services/user/user.service";
import Hash from "../../utils/hash.utils";
import { generateRefreshToken, generateToken } from "../../utils/token.utils";
import type { TaskProps } from "./task";

export type UserProps = {
    id: string;
    username: string;
    email: string;
    password: string;
    lastLogin: Date | null;

    tasks?: TaskProps[];
}

export default class User {
    private constructor(private props: UserProps) {}

    public static async create(username: string, email: string, password: string){
        const id = crypto.randomUUID().toString()
        const hashPassword = await Hash.generateHashPassword(password);
        return new User({
            id: id,
            username,
            email,
            password: hashPassword,
            lastLogin: null
        })
    }

    public static with(id: string, username: string, email: string, password: string, lastLogin: Date | null, tasks?: TaskProps[]) {
        return new User({
            id,
            username,
            email,
            password,
            lastLogin,
            tasks
        })
    }

    public async login(): Promise<LoginOutputDto> {
        const payload = {
            id: this.id,
            username: this.username,
            email: this.email
        };
        const output = {
            accessToken: generateToken(payload),
            refreshToken: generateRefreshToken(payload)
        };
        return output
    }

    public get id(): string {return this.props.id};
    public get username(): string {return this.props.username};
    public get email(): string {return this.props.email};
    public get password(): string {return this.props.password};
    public get lastLogin(): Date | null {return this.props.lastLogin};
    public get tasks(): TaskProps[] | undefined {return this.props.tasks};
}