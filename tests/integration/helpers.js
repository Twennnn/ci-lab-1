const { GenericContainer, Wait } = require('testcontainers');
const { Pool } = require('pg');
const express = require('express');
const createVisitsRouter = require('../../src/routes/visits');

async function setupTestApp() {
    // 1. Запускаем Postgres и ждем появления нужной строки в логах
    const pgContainer = await new GenericContainer('postgres:16')
        .withEnvironment({ POSTGRES_PASSWORD: 'test', POSTGRES_DB: 'testdb' })
        .withExposedPorts(5432)
        .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
        .start();

    // 2. Запускаем Redis
    const redisContainer = await new GenericContainer('redis:7')
        .withExposedPorts(6379)
        .start();

    const pgConfig = {
        host: pgContainer.getHost(),
        port: pgContainer.getMappedPort(5432),
        user: 'postgres',
        password: 'test',
        database: 'testdb',
    };
    const redisUrl = `redis://${redisContainer.getHost()}:${redisContainer.getMappedPort(6379)}`;

    // 3. Небольшая пауза (2 секунды), чтобы Postgres точно был готов принимать TCP-соединения
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Создаем таблицу
    const pool = new Pool(pgConfig);
    await pool.query('CREATE TABLE visits (id SERIAL PRIMARY KEY, created_at TIMESTAMP)');
    await pool.end();

    // 5. Поднимаем Express-приложение
    const app = express();
    const router = createVisitsRouter(pgConfig, redisUrl);
    app.use('/', router);

    return { app, router, pgContainer, redisContainer };
}

module.exports = { setupTestApp };