const request = require('supertest');
const app = require('../server');

describe('Mini Image Gallery API', () => {
  beforeEach(() => {
    // Reset images array before each test
    const server = require('../server');
    server.images.length = 0;
    server.nextId = 1;
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
    });
  });

  describe('POST /upload', () => {
    it('should upload a valid image', async () => {
      const response = await request(app)
        .post('/upload')
        .attach('image', Buffer.from('fake image data'), {
          filename: 'test.jpg',
          contentType: 'image/jpeg'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.filename).toBe('test.jpg');
    });

    it('should reject non-image files', async () => {
      const response = await request(app)
        .post('/upload')
        .attach('image', Buffer.from('fake text data'), {
          filename: 'test.txt',
          contentType: 'text/plain'
        });

      expect(response.status).toBe(400);
    });

    it('should reject when no file is uploaded', async () => {
      const response = await request(app)
        .post('/upload');

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /images/:id', () => {
    it('should delete an existing image', async () => {
      // First upload an image
      const uploadResponse = await request(app)
        .post('/upload')
        .attach('image', Buffer.from('fake image data'), {
          filename: 'test.jpg',
          contentType: 'image/jpeg'
        });

      const imageId = uploadResponse.body.id;

      // Then delete it
      const deleteResponse = await request(app)
        .delete(`/images/${imageId}`);

      expect(deleteResponse.status).toBe(200);
    });

    it('should return 404 for non-existent image', async () => {
      const response = await request(app)
        .delete('/images/999');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /images', () => {
    it('should return list of images', async () => {
      // Upload a test image
      await request(app)
        .post('/upload')
        .attach('image', Buffer.from('fake image data'), {
          filename: 'test.jpg',
          contentType: 'image/jpeg'
        });

      const response = await request(app).get('/images');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });
  });
});