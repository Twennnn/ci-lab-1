const request = require('supertest');
const { setupTestApp } = require('./helpers');

describe('Visits DB test', () => {
    let pgContainer, redisContainer, app, router;

    beforeEach(async () => {
        ({ app, router, pgContainer, redisContainer } = await setupTestApp());
    }, 180000); // 180 секунд на запуск контейнеров

    afterEach(async () => {
        if (router) await router.close();
        if (pgContainer) await pgContainer.stop();
        if (redisContainer) await redisContainer.stop();
    });

    test('first request creates a record via database', async () => {
        const res = await request(app).get('/visits');
        expect(res.statusCode).toBe(200);
        expect(res.body.source).toBe('db');
        expect(res.body.count).toBeGreaterThan(0);
    });
});