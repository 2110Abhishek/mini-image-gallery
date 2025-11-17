const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('public'));

// In-memory storage for images
class ImageStore {
  constructor() {
    this.images = [];
    this.nextId = 1;
  }

  add(image) {
    const newImage = {
      id: this.nextId++,
      filename: image.filename,
      mimeType: image.mimetype,
      data: image.buffer,
      uploadedAt: new Date().toISOString(),
      size: image.size
    };
    this.images.push(newImage);
    return newImage;
  }

  get(id) {
    return this.images.find(img => img.id === parseInt(id));
  }

  getAll() {
    return this.images.map(img => ({
      id: img.id,
      filename: img.filename,
      mimeType: img.mimeType,
      size: img.size,
      uploadedAt: img.uploadedAt,
      dimensions: img.dimensions
    }));
  }

  delete(id) {
    const index = this.images.findIndex(img => img.id === parseInt(id));
    if (index !== -1) {
      return this.images.splice(index, 1)[0];
    }
    return null;
  }

  getCount() {
    return this.images.length;
  }
}

const imageStore = new ImageStore();

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed!'), false);
    }
  },
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        error: 'File size too large. Maximum 3MB allowed.' 
      });
    }
  }
  res.status(400).json({ 
    success: false,
    error: error.message 
  });
});

// Utility function to simulate image processing
const processImage = (buffer) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        width: Math.floor(Math.random() * 800) + 400,
        height: Math.floor(Math.random() * 600) + 300
      });
    }, 100);
  });
};

// Routes

// GET /images - Get all images
app.get('/images', (req, res) => {
  try {
    const images = imageStore.getAll();
    res.json({
      success: true,
      data: images,
      count: images.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch images'
    });
  }
});

// GET /images/:id - Get specific image data
app.get('/images/:id', (req, res) => {
  try {
    const image = imageStore.get(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }
    
    res.set('Content-Type', image.mimeType);
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(image.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch image'
    });
  }
});

// POST /upload - Upload single image
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded' 
      });
    }

    // Simulate image processing
    const dimensions = await processImage(req.file.buffer);

    const newImage = imageStore.add({
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer,
      size: req.file.size
    });

    // Add dimensions to image
    newImage.dimensions = dimensions;

    console.log('🖼️ Image uploaded:', {
      id: newImage.id,
      filename: newImage.filename,
      size: (newImage.size / 1024 / 1024).toFixed(2) + ' MB',
      dimensions: `${dimensions.width}x${dimensions.height}`,
      totalImages: imageStore.getCount()
    });

    res.status(201).json({
      success: true,
      data: {
        id: newImage.id,
        filename: newImage.filename,
        mimeType: newImage.mimeType,
        size: newImage.size,
        uploadedAt: newImage.uploadedAt,
        dimensions: newImage.dimensions
      },
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to upload image' 
    });
  }
});

// DELETE /images/:id - Delete image
app.delete('/images/:id', (req, res) => {
  try {
    const deletedImage = imageStore.delete(req.params.id);
    
    if (!deletedImage) {
      return res.status(404).json({
        success: false,
        error: 'Image not found'
      });
    }

    console.log('🗑️ Image deleted:', {
      id: deletedImage.id,
      filename: deletedImage.filename,
      totalImages: imageStore.getCount()
    });

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: { id: parseInt(req.params.id) }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete image'
    });
  }
});

// Stats endpoint
app.get('/stats', (req, res) => {
  const images = imageStore.getAll();
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  
  res.json({
    success: true,
    data: {
      totalImages: images.length,
      totalSize: totalSize,
      averageSize: images.length > 0 ? totalSize / images.length : 0
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    totalImages: imageStore.getCount()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🖼️ API ready: http://localhost:${PORT}/images`);
});

module.exports = app;