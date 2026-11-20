const Media = require('../models/Media');
const Project = require('../models/Project');
const { uploadSingleFile, deleteFile } = require('../services/uploadService');

// @desc    Get all media items with reference checks
// @route   GET /api/media
// @access  Private
const getMedia = async (req, res, next) => {
  try {
    const { search, format, page = 1, limit = 24 } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ fileName: searchRegex }, { originalName: searchRegex }];
    }

    if (format && format !== 'all') {
      query.format = format.toLowerCase();
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 24;
    const skip = (pageNum - 1) * limitNum;

    const total = await Media.countDocuments(query);
    const mediaItems = await Media.find(query).sort('-createdAt').skip(skip).limit(limitNum);

    // Cross-reference with projects
    const enrichedItems = await Promise.all(
      mediaItems.map(async (item) => {
        const itemObj = item.toObject();

        const referencingProjects = await Project.find({
          $or: [
            { 'coverImage.url': item.url },
            { 'coverImage.publicId': item.publicId },
            { 'galleryImages.url': item.url },
            { 'galleryImages.publicId': item.publicId }
          ]
        }).select('title slug isPublished');

        itemObj.usedInProjects = referencingProjects.map((p) => ({
          projectId: p._id,
          title: p.title,
          slug: p.slug
        }));
        itemObj.isUsed = referencingProjects.length > 0;

        return itemObj;
      })
    );

    res.status(200).json({
      success: true,
      count: enrichedItems.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      media: enrichedItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload media files directly
// @route   POST /api/media/upload
// @access  Private
const uploadMedia = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      // If single file uploaded under 'file' or 'image'
      const single = req.file || (req.files && req.files.image && req.files.image[0]);
      if (!single) {
        return res.status(400).json({ success: false, message: 'Please select at least one image file to upload' });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const uploaded = await uploadSingleFile(single, baseUrl);

      return res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        media: uploaded
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const filesToUpload = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();

    const uploadResults = await Promise.all(
      filesToUpload.map((file) => uploadSingleFile(file, baseUrl))
    );

    res.status(201).json({
      success: true,
      message: `${uploadResults.length} file(s) uploaded successfully`,
      media: uploadResults
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media file with safe reference check
// @route   DELETE /api/media/:id
// @access  Private
const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media item not found' });
    }

    const { force } = req.query;

    // Check if referenced in projects
    const referencingProjects = await Project.find({
      $or: [
        { 'coverImage.url': media.url },
        { 'coverImage.publicId': media.publicId },
        { 'galleryImages.url': media.url },
        { 'galleryImages.publicId': media.publicId }
      ]
    }).select('title');

    if (referencingProjects.length > 0 && force !== 'true') {
      const projectNames = referencingProjects.map((p) => `"${p.title}"`).join(', ');
      return res.status(400).json({
        success: false,
        isUsed: true,
        message: `This image cannot be deleted because it is currently used in project(s): ${projectNames}. Remove it from the project first or use force=true.`
      });
    }

    await deleteFile(media.publicId, media.url);
    await Media.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMedia,
  uploadMedia,
  deleteMedia
};
