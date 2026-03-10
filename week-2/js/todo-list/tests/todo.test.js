const request = require('supertest')
const createApp = require('../src/createApp')



describe('ToDo API', () => {
    let app;

    beforeEach(() => {
        app = createApp();
    });

    test('GET /todos returns empyt list initially', async () => {
        const res = await request(app).get('/todos');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([])
    });


    test('POST /todo creates a todo', async () => {
        const res = await request(app).post('/todos').send({
            'description': "Buy chicken"
        })
        expect(res.status).toEqual(201)
        expect(res.body.description).toBe('Buy chicken')
        expect(res.body.status).toBe('Planned')
        expect(res.body.id).toBeDefined();
    })
});
