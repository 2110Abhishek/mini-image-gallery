import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with better configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Loading Spinner Component
const LoadingSpinner = ({ size = 'medium' }) => (
  <div className={`spinner ${size}`}>
    <div className="spinner-ring"></div>
  </div>
);

// Image Card Component
const ImageCard = ({ image, onDelete }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = () => {
    onDelete(image.id);
  };

  const handleImageError = () => {
    console.error(`❌ Failed to load image ${image.id}`);
    setImageError(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="image-card">
      <div className="image-container">
        {!imageLoaded && !imageError && (
          <div className="image-placeholder">
            <LoadingSpinner size="small" />
            <span>Loading...</span>
          </div>
        )}
        
        {imageError ? (
          <div className="image-error">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <p>Failed to load image</p>
            </div>
          </div>
        ) : (
          <img 
            src={`${API_BASE_URL}/images/${image.id}`}
            alt={image.filename}
            onLoad={() => {
              console.log(`✅ Image ${image.id} loaded successfully`);
              setImageLoaded(true);
            }}
            onError={handleImageError}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        )}
        
        <div className="image-overlay">
          <button 
            className="delete-btn"
            onClick={handleDelete}
            title="Delete image"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="image-info">
        <div className="image-meta">
          <h4 className="filename" title={image.filename}>
            {image.filename}
          </h4>
          <div className="meta-details">
            <span className="file-size">{formatFileSize(image.size)}</span>
            {image.dimensions && (
              <span className="dimensions">
                {image.dimensions.width} × {image.dimensions.height}
              </span>
            )}
          </div>
          <div className="upload-time">
            Uploaded {formatDate(image.uploadedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Upload Area Component
const UploadArea = ({ onUpload, isUploading, uploadProgress }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (JPEG or PNG)');
        return;
      }

      // Validate file size (3MB)
      if (file.size > 3 * 1024 * 1024) {
        alert('File size must be less than 3MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
    }
  };

  return (
    <div className="upload-section">
      <div 
        className={`upload-area ${isDragOver ? 'drag-over' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="upload-progress">
            <LoadingSpinner />
            <div className="progress-content">
              <h3>Uploading Image...</h3>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          </div>
        ) : (
          <>
            <div className="upload-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M14.2698 3.5H9.73022C9.02903 3.5 8.37617 3.85817 7.99401 4.4519L6.49401 6.9519C6.11185 7.54563 5.45899 7.9038 4.7578 7.9038H3C2.44772 7.9038 2 8.35152 2 8.9038V17.5C2 18.6046 2.89543 19.5 4 19.5H20C21.1046 19.5 22 18.6046 22 17.5V8.9038C22 8.35152 21.5523 7.9038 21 7.9038H19.2422C18.541 7.9038 17.8882 7.54563 17.506 6.9519L16.006 4.4519C15.6238 3.85817 14.971 3.5 14.2698 3.5Z" 
                  stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            
            <div className="upload-content">
              <h3>Drop your image here</h3>
              <p>or</p>
              
              <div className="upload-controls">
                <input
                  id="file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="file-input"
                />
                <label htmlFor="file-input" className="browse-btn">
                  Browse Files
                </label>
              </div>

              <p className="upload-hint">
                Supports JPEG, PNG • Max 3MB
              </p>
            </div>
          </>
        )}
      </div>

      {selectedFile && !isUploading && (
        <div className="selected-file">
          <div className="file-preview">
            <span className="file-icon">📷</span>
            <div className="file-details">
              <strong>{selectedFile.name}</strong>
              <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
          <button 
            className="upload-confirm-btn"
            onClick={handleUploadClick}
          >
            Upload Now
          </button>
        </div>
      )}
    </div>
  );
};

// Main App Component
function App() {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch images on component mount
  useEffect(() => {
    console.log('🔄 Component mounted, fetching images...');
    fetchImages();
    fetchStats();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching images from API...');
      const response = await api.get('/images');
      console.log('📸 Images fetched:', response.data);
      
      if (response.data.success) {
        setImages(response.data.data);
        console.log('✅ Images state updated with:', response.data.data.length, 'images');
      } else {
        console.error('❌ API returned success: false', response.data);
        setError('Failed to load images from server');
      }
    } catch (error) {
      console.error('❌ Error fetching images:', error);
      console.error('Error details:', error.response?.data);
      setError(`Failed to load images. Make sure the backend is running on ${API_BASE_URL}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    const formData = new FormData();
    formData.append('image', file);

    console.log('⬆️ Starting upload for file:', file.name, file.size, file.type);

    try {
      const response = await api.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          console.log(`📊 Upload progress: ${percentCompleted}%`);
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Upload response:', response.data);

      if (response.data.success) {
        console.log('🖼️ Adding new image to gallery:', response.data.data);
        // Add new image to the beginning of the list
        setImages(prev => {
          const newImages = [response.data.data, ...prev];
          console.log('🔄 Images state after upload:', newImages.length, 'images');
          return newImages;
        });
        fetchStats(); // Refresh stats
      } else {
        setError(response.data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.error || 'Failed to upload image. Check console for details.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting image:', imageId);
      const response = await api.delete(`/images/${imageId}`);
      
      if (response.data.success) {
        console.log('✅ Delete successful, updating state...');
        setImages(prev => {
          const newImages = prev.filter(img => img.id !== imageId);
          console.log('🔄 Images after deletion:', newImages.length, 'remaining');
          return newImages;
        });
        fetchStats();
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      setError('Failed to delete image');
    }
  };

  const formatTotalSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>📷 Mini Image Gallery</h1>
            <p>Beautifully organize and manage your images</p>
          </div>
          
          {stats && (
            <div className="header-stats">
              <div className="stat">
                <span className="stat-number">{stats.totalImages}</span>
                <span className="stat-label">Images</span>
              </div>
              <div className="stat">
                <span className="stat-number">{formatTotalSize(stats.totalSize)}</span>
                <span className="stat-label">Total Size</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {/* Upload Section */}
        <section className="main-section">
          <UploadArea 
            onUpload={handleUpload}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </section>

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
            <button 
              className="error-close"
              onClick={() => setError('')}
            >
              ×
            </button>
          </div>
        )}

        {/* Gallery Section */}
        <section className="main-section">
          <div className="section-header">
            <h2>Your Gallery</h2>
            <div className="gallery-controls">
              <span className="image-count">
                {images.length} image{images.length !== 1 ? 's' : ''}
              </span>
              {images.length > 0 && (
                <button 
                  className="refresh-btn"
                  onClick={fetchImages}
                  disabled={loading}
                >
                  🔄 Refresh
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <LoadingSpinner />
              <p>Loading your images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🖼️</div>
              <h3>No images yet</h3>
              <p>Upload your first image to get started!</p>
            </div>
          ) : (
            <div className="image-grid">
              {images.map(image => (
                <ImageCard 
                  key={image.id} 
                  image={image} 
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Mini Image Gallery • Built with React & Node.js</p>
      </footer>
    </div>
  );
}

export default App;