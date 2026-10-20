const request = require('supertest');
const { setupTestApp } = require('./helpers');

describe('Visits Cache test', () => {
    let pgContainer, redisContainer, app, router;

    beforeEach(async () => {
        ({ app, router, pgContainer, redisContainer } = await setupTestApp());
    }, 180000);

    afterEach(async () => {
        if (router) await router.close();
        if (pgContainer) await pgContainer.stop();
        if (redisContainer) await redisContainer.stop();
    });

    test('second request within TTL is served from cache', async () => {
        await request(app).get('/visits');
        const res = await request(app).get('/visits');
        expect(res.body.source).toBe('cache');
    });
});