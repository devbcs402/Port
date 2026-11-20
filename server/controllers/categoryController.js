const Category = require('../models/Category');
const Project = require('../models/Project');
const slugify = require('slugify');

// @desc    Get all categories (with project count)
// @route   GET /api/categories
// @access  Public / Private
const getCategories = async (req, res, next) => {
  try {
    const filter = req.admin ? {} : { isActive: true };
    const categories = await Category.find(filter).sort('order name');

    // Attach dynamic project count
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Project.countDocuments({
          category: cat._id,
          ...(req.admin ? {} : { isPublished: true })
        });
        const obj = cat.toObject();
        obj.projectCount = count;
        return obj;
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug.toLowerCase() });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const projects = await Project.find({
      category: category._id,
      isPublished: true
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      category,
      projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name, description, thumbnail, order, isActive } = req.body;
    let { slug } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    if (!slug) {
      slug = slugify(name, { lower: true, strict: true });
    } else {
      slug = slugify(slug, { lower: true, strict: true });
    }

    const exists = await Category.findOne({ $or: [{ name }, { slug }] });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name or slug already exists'
      });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      thumbnail: thumbnail || { url: '', publicId: '' },
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const { name, description, thumbnail, order, isActive } = req.body;
    let { slug } = req.body;

    if (slug) {
      slug = slugify(slug, { lower: true, strict: true });
      const duplicate = await Category.findOne({ slug, _id: { $ne: category._id } });
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Slug already taken by another category' });
      }
      category.slug = slug;
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (thumbnail) category.thumbnail = thumbnail;
    if (order !== undefined) category.order = Number(order);
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if projects are using this category
    const projectCount = await Project.countDocuments({ category: category._id });
    if (projectCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It is currently linked to ${projectCount} project(s). Reassign them first.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};
