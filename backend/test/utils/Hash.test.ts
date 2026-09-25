import Hash from "../../src/utils/hash.utils";

test("Deve gerar uma senha criptografada", async() => {
    const senha = 'teste123';
    const hash = await Hash.generateHashPassword(senha);
    expect(senha).not.toBe(hash);
})

test("Deve validar uma senha criptografada", async() => {
    const senha = 'teste123';
    const hash = await Hash.generateHashPassword(senha);
    const isValid = await Hash.matchPassword(senha, hash);
    expect(isValid).toBe(true);
})