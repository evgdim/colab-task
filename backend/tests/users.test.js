const request = require('supertest');
const express = require('express');
const userRoutes = require('../routes/users');

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

describe('Users API', () => {
    // Sample data to test with
    let initialUsers = [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
    ];

    beforeEach(() => {
        // Mock in-memory data for testing
        //const mockRouter = require('../routes/users');
        //mockRouter.__setMockData(initialUsers);
    });

    it('GET /api/users should return all users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0]).toHaveProperty('name', 'Alice');
    });

    it('GET /api/users/:id should return a single user', async () => {
        const res = await request(app).get('/api/users/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'Alice');
    });

    it('POST /api/users should create a new user', async () => {
        const newUser = { name: 'Charlie', email: 'charlie@example.com' };
        const res = await request(app).post('/api/users').send(newUser);
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('name', 'Charlie');
    });

    it('PUT /api/users/:id should update an existing user', async () => {
        const updatedUser = { name: 'Alice Updated' };
        const res = await request(app).put('/api/users/1').send(updatedUser);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'Alice Updated');
    });

    it('DELETE /api/users/:id should delete a user', async () => {
        const res = await request(app).delete('/api/users/1');
        expect(res.statusCode).toBe(204);

        // Confirm the user is deleted
        const getRes = await request(app).get('/api/users');
        expect(getRes.body.length).toBe(1);
    });

    it('GET /api/users/:id should return 404 for a non-existent user', async () => {
        const res = await request(app).get('/api/users/999');
        expect(res.statusCode).toBe(404);
        expect(res.text).toBe('User not found');
    });
});
