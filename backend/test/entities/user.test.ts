import {faker} from "@faker-js/faker"
import * as bcrypt from "bcrypt"
import User from "../../src/models/entities/user";

describe('Testes da entidade de Usuario', () => {
    test('Deve criar um usuario valido', async() => {
        const username = faker.internet.username();
        const email = faker.internet.email();
        const senha = faker.internet.password();
        const usuario = await User.create(username, email, senha);
        expect(usuario).toBeInstanceOf(User);
    })

    describe('Testes dos getters na entidade Usuario', () => {
        let username = faker.internet.username();
        let email = faker.internet.email();
        let senha = faker.internet.password();

        test('Deve retornar o id do usuario pelo getter', async() => {
            const usuario = await User.create(username, email, senha);
            expect(usuario.id).toBeDefined();
        })

        test('Deve retornar o nome de usuario pelo getter', async() => {
            username = 'teste123';
            const usuario = await User.create(username, email, senha);
            expect(usuario.username).toBe('teste123');
        })

        test('Deve retornar o email do usuario pelo getter', async() => {
            email = 'teste@testando.com';
            const usuario = await User.create(username, email, senha);
            expect(usuario.email).toBe('teste@testando.com');
        })

        test('Deve retornar a senha do usuario pelo getter (codificada)', async() => {
            senha = 'teste00';
            const usuario = await User.create(username, email, senha);
            expect(bcrypt.compare(senha, usuario.password)).toBeTruthy();
        })
    })
});

