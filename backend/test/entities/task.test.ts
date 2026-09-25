import { ta } from "zod/locales";
import Task, { Priority, Status } from "../../src/models/entities/task";

describe('Testes da entidade de Tarefa', () => {
    test('Deve criar uma tarefa valida', async() => {
        const titulo = 'Tarefa de teste';
        const descricao = 'Descricao da tarefa de teste';
        const userId = crypto.randomUUID().toString();
        const tarefa = await Task.create(userId, titulo, descricao, Priority.Medium, Status.PENDING);
        expect(tarefa).toBeInstanceOf(Task);
    })

    describe('Teste dos getters da entidade Tarefa', () => {
        let tarefa: Task;
        beforeAll(async() => {
            tarefa = await Task.create(
                "Sd1231", 
                "limpar os pratos", 
                "limpar os pratos apos o jantar", 
                Priority.High, 
                Status.IN_PROGRESS
            );
        })
        test('Deve retornar o Id da tarefa', async() => {
            expect(tarefa.id).toBeDefined();
        });
        test('Deve retornar o titulo da tarefa', () => {
            expect(tarefa.title).toBe('limpar os pratos');
        });
        test('Deve retornar a descricao da tarefa', () => {
            expect(tarefa.description).toBe('limpar os pratos apos o jantar');
        });
        test('Deve retornar a prioridade da tarefa', () => {
            expect(tarefa.priority).toEqual(Priority.High);
        });
        test('Deve retornar o status da tarefa', () => {
            expect(tarefa.status).toEqual(Status.IN_PROGRESS);
        })
    })

    describe('Teste dos getters com campos undefined', () => {
        let tarefaComCamposUndefined: Task;
        beforeAll(async() => {
            tarefaComCamposUndefined = await Task.create(
                'SSA934ASK',
                'compras no supermercado'
            )
        })

        test('Deve retornar UNDEFINED para o getter de (description)', () => {
            expect(tarefaComCamposUndefined.description).toBeUndefined()
        })
    })
});