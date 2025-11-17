📷 Mini Image Gallery
A beautiful, full-stack image gallery application built with React frontend and Node.js backend. Upload, view, and manage your images with an elegant and responsive interface.

https://img.shields.io/badge/React-18.2.0-blue https://img.shields.io/badge/Node.js-16+-green https://img.shields.io/badge/License-MIT-yellow

✨ Features
🖼️ Image Upload - Drag & drop or click to upload (JPEG/PNG, max 3MB)

🎯 Instant Gallery - Uploaded images appear immediately in a responsive grid

🗑️ Easy Management - Delete images with one click

📱 Fully Responsive - Works perfectly on desktop, tablet, and mobile

⚡ Real-time Progress - Visual upload progress indicator

🎨 Modern UI - Dark theme with smooth animations and glass morphism effects

📊 Live Statistics - Track total images and storage usage

🏗️ Project Structure
text
mini-image-gallery/
├── backend/          # Node.js/Express API
│   ├── server.js     # Main server file
│   ├── package.json  # Backend dependencies
│   └── tests/        # Unit tests
└── frontend/         # React application
    ├── src/
    │   ├── App.js    # Main React component
    │   └── App.css   # Styling
    └── package.json  # Frontend dependencies
🚀 Quick Start
Prerequisites
Node.js (v16 or higher)

npm (v8 or higher)

Backend Setup & Run
Navigate to backend directory and install dependencies:

bash
cd backend
npm install
Start the backend server:

bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
Verify backend is running:

Server runs on http://localhost:5000

Health check: http://localhost:5000/health

You should see: 🚀 Server running on port 5000

Frontend Setup & Run
Open a new terminal and navigate to frontend directory:

bash
cd frontend
npm install
Start the React development server:

bash
npm start
Access the application:

Frontend runs on http://localhost:3000

The browser should automatically open

Running Both Servers
Make sure both servers are running simultaneously:

Backend: http://localhost:5000

Frontend: http://localhost:3000

🧪 Running Tests
Backend Unit Tests
bash
cd backend
npm test
This will run the test suite and display coverage information.

Test Coverage Includes:
✅ Image upload validation

✅ File type and size checks

✅ GET/POST/DELETE endpoints

✅ Error handling

✅ Memory storage operations

📱 Responsive Design
The application is fully responsive and optimized for:

Desktop (1200px+): 4-column grid layout

Tablet (768px-1199px): 3-column grid layout

Mobile (480px-767px): 2-column grid layout

Small Mobile (<480px): 1-column grid layout

🎨 Design Choices
Backend Design
Memory Storage: Images stored in RAM using custom ImageStore class for simplicity (resets on server restart)

RESTful API: Clean, predictable endpoints with proper HTTP status codes

Multer Middleware: Robust file upload handling with validation

Error Handling: Comprehensive error responses with user-friendly messages

CORS Enabled: Proper cross-origin resource sharing configuration

Frontend Design
Modern React Hooks: useState, useEffect for state management

Component Architecture: Modular, reusable components (ImageCard, UploadArea)

Dark Theme: Eye-friendly interface with gradient accents

Glass Morphism: Contemporary design with backdrop blur effects

Smooth Animations: CSS transitions and hover effects for better UX

Axios Interceptors: Enhanced API communication with logging

Performance Optimizations
Lazy Loading: Images load on demand with loading states

Memory Management: Efficient image storage and cleanup

Progress Indicators: Real-time upload feedback

Error Boundaries: Graceful error handling and retry mechanisms

🔧 API Endpoints
Method	Endpoint	Description
GET	/health	Server health check
GET	/images	Get all uploaded images
GET	/images/:id	Get specific image data
POST	/upload	Upload a new image
DELETE	/images/:id	Delete an image
GET	/stats	Get gallery statistics
📦 Dependencies
Backend
express: Web server framework

multer: File upload middleware

cors: Cross-origin resource sharing

jest: Testing framework (dev)

supertest: HTTP assertion testing (dev)

Frontend
react: UI framework

axios: HTTP client for API calls

react-dom: DOM rendering for React

🛠️ Development
Backend Development
bash
cd backend
npm run dev  # Uses nodemon for auto-restart
Frontend Development
bash
cd frontend
npm start    # React development server with hot reload
Building for Production
bash
cd frontend
npm run build  # Creates optimized production build
🐛 Troubleshooting
Common Issues
Images not showing after upload

Check browser console for CORS errors

Verify backend is running on port 5000

Ensure frontend is making requests to correct API URL

Upload fails

Verify file is JPEG/PNG and under 3MB

Check backend console for error messages

Ensure multer configuration is correct

CORS errors

Backend CORS is configured for http://localhost:3000

Verify frontend URL matches CORS settings

Port already in use

Change PORT in backend/.env or use different port

Kill existing process: npx kill-port 5000

📄 License
This project is licensed under the MIT License.

🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📞 Support
If you encounter any issues or have questions:

Check the troubleshooting section above

Look at the browser console for error messages

Verify both backend and frontend servers are running

Check the network tab in browser DevTools for failed requests

Built with ❤️ using React & Node.js

🎯 Bonus Tasks Completed
✅ Backend Unit Tests
Comprehensive test suite covering:

Image upload validation

File type and size restrictions

API endpoint functionality

Error handling scenarios

Memory storage operations

✅ Frontend Responsiveness
Fully responsive design that works seamlessly across:

Desktop computers (1200px+)

Laptops (992px-1199px)

Tablets (768px-991px)

Mobile phones (480px-767px)

Small mobile devices (<480px)

The responsive grid automatically adjusts from 4 columns on desktop to 1 column on mobile, ensuring optimal viewing experience on all devices.
