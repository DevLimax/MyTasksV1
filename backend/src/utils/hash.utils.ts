import * as bcrypt from "bcrypt";

export default class Hash {
    private static saltRounds = 10;

    static async generateHashPassword(password: string): Promise<string> {
        const hashPassword = await bcrypt.hash(password, this.saltRounds);
        return hashPassword
    }

    static async matchPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}