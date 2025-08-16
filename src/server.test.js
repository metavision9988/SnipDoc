const request = require('supertest');
const app = require('./server');

describe('PDF Converter API', () => {
  describe('POST /api/convert', () => {
    test('should convert HTML to PDF', async () => {
      const response = await request(app)
        .post('/api/convert')
        .send({
          content: '<h1>Test Document</h1>',
          inputType: 'html',
          settings: {
            pageSize: 'A4',
            orientation: 'portrait',
            marginTop: 20,
            marginBottom: 20,
            marginLeft: 20,
            marginRight: 20
          }
        })
        .expect('Content-Type', /application\/pdf/)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    test('should convert Markdown to PDF', async () => {
      const response = await request(app)
        .post('/api/convert')
        .send({
          content: '# Test Document\n\nThis is a test.',
          inputType: 'markdown',
          settings: {
            pageSize: 'A4',
            orientation: 'portrait'
          }
        })
        .expect('Content-Type', /application\/pdf/)
        .expect(200);

      expect(response.body).toBeDefined();
    });

    test('should return 400 for empty content', async () => {
      const response = await request(app)
        .post('/api/convert')
        .send({
          content: '',
          inputType: 'html',
          settings: {}
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    test('should return 400 for invalid settings', async () => {
      const response = await request(app)
        .post('/api/convert')
        .send({
          content: '<h1>Test</h1>',
          inputType: 'html',
          settings: {
            pageSize: 'InvalidSize'
          }
        })
        .expect(400);

      expect(response.body.error).toContain('Invalid page size');
    });
  });

  describe('POST /api/preview', () => {
    test('should return processed HTML for preview', async () => {
      const response = await request(app)
        .post('/api/preview')
        .send({
          content: '<h1>Test</h1>',
          inputType: 'html',
          settings: {
            pageSize: 'A4',
            orientation: 'portrait'
          }
        })
        .expect('Content-Type', /text\/html/)
        .expect(200);

      expect(response.text).toContain('<h1>Test</h1>');
      expect(response.text).toContain('@page');
    });

    test('should process Markdown for preview', async () => {
      const response = await request(app)
        .post('/api/preview')
        .send({
          content: '# Test',
          inputType: 'markdown',
          settings: {}
        })
        .expect(200);

      expect(response.text).toContain('<h1');
      expect(response.text).toContain('Test');
    });
  });

  describe('Static files', () => {
    test('should serve index.html', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(200);

      expect(response.text).toContain('PDF Converter');
    });
  });
});