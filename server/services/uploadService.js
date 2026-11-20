const path = require('path');
const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const Media = require('../models/Media');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Upload a single file buffer or file info
 * @param {Object} file - Multer file object
 * @param {String} baseUrl - e.g. http://localhost:5000
 */
const uploadSingleFile = async (file, baseUrl = '') => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const cleanBaseName = path.basename(file.originalname, path.extname(file.originalname))
    .replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueName = `${Date.now()}-${cleanBaseName}.${ext}`;

  if (isCloudinaryConfigured()) {
    // Upload via stream to Cloudinary
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'graphic_portfolio',
          resource_type: 'image'
        },
        async (error, result) => {
          if (error) return reject(error);

          try {
            const mediaRecord = await Media.create({
              fileName: uniqueName,
              originalName: file.originalname,
              url: result.secure_url,
              publicId: result.public_id,
              mimeType: file.mimetype,
              size: result.bytes || file.size,
              width: result.width || 0,
              height: result.height || 0,
              format: result.format || ext,
              storageProvider: 'cloudinary'
            });

            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              mediaId: mediaRecord._id,
              fileName: uniqueName,
              size: result.bytes || file.size,
              storageProvider: 'cloudinary'
            });
          } catch (dbErr) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              fileName: uniqueName,
              size: result.bytes || file.size,
              storageProvider: 'cloudinary'
            });
          }
        }
      );

      // Multer memory storage provides file.buffer
      if (file.buffer) {
        stream.end(file.buffer);
      } else if (file.path) {
        fs.createReadStream(file.path).pipe(stream);
      } else {
        reject(new Error('Invalid file payload for streaming'));
      }
    });
  } else {
    // Local storage fallback
    const targetPath = path.join(uploadsDir, uniqueName);

    if (file.buffer) {
      await fs.promises.writeFile(targetPath, file.buffer);
    } else if (file.path && file.path !== targetPath) {
      await fs.promises.copyFile(file.path, targetPath);
    }

    const fileUrl = `${baseUrl}/uploads/${uniqueName}`;

    try {
      const mediaRecord = await Media.create({
        fileName: uniqueName,
        originalName: file.originalname,
        url: fileUrl,
        publicId: uniqueName,
        mimeType: file.mimetype,
        size: file.size,
        format: ext,
        storageProvider: 'local'
      });

      return {
        url: fileUrl,
        publicId: uniqueName,
        mediaId: mediaRecord._id,
        fileName: uniqueName,
        size: file.size,
        storageProvider: 'local'
      };
    } catch (dbErr) {
      return {
        url: fileUrl,
        publicId: uniqueName,
        fileName: uniqueName,
        size: file.size,
        storageProvider: 'local'
      };
    }
  }
};

/**
 * Delete file from Cloudinary or local disk
 */
const deleteFile = async (publicId, url = '') => {
  if (!publicId && !url) return false;

  try {
    if (isCloudinaryConfigured() && publicId && !publicId.includes('.')) {
      await cloudinary.uploader.destroy(publicId);
    } else {
      // Local delete
      const fileName = publicId || path.basename(url);
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    }

    // Delete media record if exists
    await Media.deleteOne({
      $or: [{ publicId }, { url }]
    });

    return true;
  } catch (error) {
    console.error('[UploadService Delete Error]', error);
    return false;
  }
};

module.exports = {
  uploadSingleFile,
  deleteFile
};
