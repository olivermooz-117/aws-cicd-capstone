const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  test('returns the hello page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Hello from AWS CI/CD Capstone Project!');
  });
});

describe('GET /health', () => {
  test('returns status ok as JSON', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('unknown routes', () => {
  test('return 404', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.statusCode).toBe(404);
  });
});
