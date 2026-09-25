import z from "zod";

export const userCreateSchema = z.object({
    username: z.string({error: 'o campo username deve ser um string'})
                .min(3, {error: 'username deve ter pelo menos 3 caracteres'})
                .max(16, {error: 'username deve ter menos de 16 caracteres'}),
    
    email: z.email({error: 'Email invalido'}),
    password: z.string({error: 'a senha deve ser uma string'})
                .min(6, {error: 'senha deve ter mais de 6 caracteres'})
                .max(18, {error: 'senha deve ter menos de 18 caracteres'})
})

export const userUpdateSchema = z.object({
    username: z.string({error: 'o campo username deve ser um string'})
                .min(3, {error: 'username deve ter pelo menos 3 caracteres'})
                .max(16, {error: 'username deve ter menos de 16 caracteres'})
                .optional(),
    
    email: z.email({error: 'Email invalido'}).optional(),
    password: z.string({error: 'a senha deve ser uma string'})
                .min(6, {error: 'senha deve ter mais de 6 caracteres'})
                .max(18, {error: 'senha deve ter menos de 18 caracteres'})
                .optional()
})

export const userLoginSchema = z.object({
    email: z.email({error: 'invalid email'}).nonoptional({error: 'email not provided'}),
    password: z.string({error: 'invalid password'}).nonoptional({error: 'password not provided'})
})