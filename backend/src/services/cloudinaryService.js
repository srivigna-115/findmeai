const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

const isConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'demo';

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured');
} else {
  console.log('⚠️  Cloudinary not configured - using local file storage');
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

exports.uploadToCloudinary = async (file) => {
  if (isConfigured) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'findme', resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      uploadStream.end(file.buffer);
    });
  }

  // Local fallback
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const fileName = `${Date.now()}-${file.originalname}`;
    fs.writeFileSync(path.join(uploadsDir, fileName), file.buffer);
    return `/uploads/${fileName}`;
  } catch (err) {
    // Last resort: base64
    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  }
};
