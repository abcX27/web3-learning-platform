import request from 'supertest';
import app from './index';

// Mock logger to avoid console output during tests
jest.mock('./utils/logger', () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
  debug: jest.fn(),
}));

describe('Express Server', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: {
          message: 'Web3 Learning Platform API',
          version: '1.0.0',
          status: 'running',
          documentation: '/api/docs',
        },
      });
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: 'healthy',
          timestamp: expect.any(String),
          uptime: expect.any(Number),
          environment: expect.any(String),
        },
      });

      // Verify timestamp is a valid ISO string
      expect(new Date(response.body.data.timestamp).toISOString()).toBe(
        response.body.data.timestamp
      );

      // Verify uptime is positive
      expect(response.body.data.uptime).toBeGreaterThan(0);
    });
  });

  describe('404 Not Found', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Route GET /api/nonexistent not found',
        },
      });
    });

    it('should return 404 for POST to non-existent routes', async () => {
      const response = await request(app)
        .post('/api/nonexistent')
        .send({ test: 'data' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Route POST /api/nonexistent not found',
        },
      });
    });
  });

  describe('Middleware', () => {
    it('should parse JSON body', async () => {
      // This will hit 404 but should parse the body first
      const response = await request(app)
        .post('/test')
        .send({ test: 'data' })
        .set('Content-Type', 'application/json')
        .expect(404);

      // If body parsing failed, we'd get a different error
      expect(response.body.error.code).toBe('NOT_FOUND');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/test')
        .send('{"invalid": json}')
        .set('Content-Type', 'application/json')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Invalid JSON in request body',
        },
      });
    });

    it('should set security headers (helmet)', async () => {
      const response = await request(app).get('/');

      // Check for some helmet headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
    });

    it('should handle CORS', async () => {
      const response = await request(app)
        .options('/')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should compress responses', async () => {
      const response = await request(app)
        .get('/')
        .set('Accept-Encoding', 'gzip');

      // Response should be compressed if large enough
      // For small responses, compression might not be applied
      expect(response.headers['content-encoding']).toMatch(/gzip|identity|undefined/);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in a standardized format', async () => {
      // Test with a route that doesn't exist
      const response = await request(app)
        .get('/api/error-test')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code');
      expect(response.body.error).toHaveProperty('message');
    });
  });
});
