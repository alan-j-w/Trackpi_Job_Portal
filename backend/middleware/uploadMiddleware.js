import multer from 'multer';
import path from 'path';
// import fs from 'fs';

// Ensure uploads directory exists
// const uploadDir = 'uploads/testimonials';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// Configure storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//   // Accept images and videos
//   if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image and video files are allowed'), false);
//   }
// };

// Upload middleware

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});


export default upload;