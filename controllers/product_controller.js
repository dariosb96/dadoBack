const { Op } = require("sequelize");
const sequelize = require("../db"); // 👈 importa tu instancia
const Product = require("../models/Product");
const User = require("../models/User");
const Category = require("../models/Category");
const ProductImage = require("../models/ProductImage");
const ProductVariant = require("../models/ProductVariant");
const VariantImage = require("../models/VariantImage");
const cloudinary = require("../middlewares/cloudinary");

const getUserWithOrg = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("Usuario no encontrado");
  if (!user.organizationId) throw new Error("Usuario sin organización asignada");
  return user;
};

/* ================= GET ================= */

const getActiveProd = async (userId) => {
  const user = await getUserWithOrg(userId);

  return Product.findAll({
    where: { isActive: true, organizationId: user.organizationId },
    include: [
      { model: Category },
      { model: ProductImage, as: "images" },
      {
        model: ProductVariant,
        as: "variants",
        include: [{ model: VariantImage, as: "images" }],
      },
    ],
  });
};

const getAllProd = async (userId) => {
  const user = await getUserWithOrg(userId);

  return Product.findAll({
    where: { organizationId: user.organizationId },
    include: [
      { model: Category },
      { model: ProductImage, as: "images" },
      {
        model: ProductVariant,
        as: "variants",
        include: [{ model: VariantImage, as: "images" }],
      },
    ],
  });
};

/* ================= CREATE ================= */

const createProduct = async (data, files = {}) => {
  return sequelize.transaction(async (t) => {
    const user = await getUserWithOrg(data.userId);

    const product = await Product.create(
      { ...data, organizationId: user.organizationId },
      { transaction: t }
    );

    const productFiles = files.images || [];
    if (productFiles.length) {
      await ProductImage.bulkCreate(
        productFiles.map((file) => ({
          productId: product.id,
          url: file.path,
          public_id: file.filename,
        })),
        { transaction: t }
      );
    }

    for (let i = 0; i < (data.variants?.length || 0); i++) {
      const v = data.variants[i];

      const newVariant = await ProductVariant.create(
        {
          productId: product.id,
          color: v.color || null,
          size: v.size || null,
          stock: v.stock ?? 0,
          price: v.price ?? product.price,
          buyPrice: v.buyPrice ?? product.buyPrice,
          organizationId: user.organizationId,
        },
        { transaction: t }
      );

      const variantFiles = files[`variantImages_${i}`] || [];
      if (variantFiles.length) {
        await VariantImage.bulkCreate(
          variantFiles.map((file) => ({
            variantId: newVariant.id,
            url: file.path,
            public_id: file.filename,
          })),
          { transaction: t }
        );
      }
    }

    return Product.findByPk(product.id, {
      include: [
        { model: ProductImage, as: "images" },
        { model: ProductVariant, as: "variants", include: [{ model: VariantImage, as: "images" }] },
        { model: Category },
      ],
      transaction: t,
    });
  });
};

/* ================= UPDATE ================= */

const updateProduct = async (req) => {
  const user = await getUserWithOrg(req.userId);
  const { id } = req.params;

  const product = await Product.findOne({
    where: { id, organizationId: user.organizationId },
    include: [
      { model: ProductImage, as: "images" },
      { model: ProductVariant, as: "variants", include: { model: VariantImage, as: "images" } },
    ],
  });

  if (!product) throw new Error("Producto no encontrado");

  const data = req.body;
  const filesByField = req.filesByField || {};

  if (data.imagesToDelete) {
    const ids = JSON.parse(data.imagesToDelete);
    const imgs = await ProductImage.findAll({ where: { id: ids } });

    for (const img of imgs) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
      await img.destroy();
    }
  }

  const mainImages = filesByField.images || [];
  if (mainImages.length) {
    await ProductImage.bulkCreate(
      mainImages.map((file) => ({
        url: file.path,
        public_id: file.filename,
        productId: product.id,
      }))
    );
  }

  await product.update({
    name: data.name ?? product.name,
    description: data.description ?? product.description,
    buyPrice: data.buyPrice ?? product.buyPrice,
    price: data.price ?? product.price,
    stock: data.stock ?? product.stock,
    categoryId: data.categoryId ?? product.categoryId,
  });

  return getProductById(id, req.userId);
};

/* ================= GET PRODUCT BY ID ================= */
const getProductById = async (id, userId) => {
  const user = await getUserWithOrg(userId);

  const product = await Product.findOne({
    where: {
      id,
      organizationId: user.organizationId, // 🔥 evita ver productos de otra org
    },
    include: [
      { model: Category },
      { model: ProductImage, as: "images" },
      {
        model: ProductVariant,
        as: "variants",
        include: [{ model: VariantImage, as: "images" }],
      },
    ],
  });

  if (!product) throw new Error("Producto no encontrado");

  return product;
};

/* ================= DELETE (HARD) ================= */

const deleteProduct = async (id, userId) => {
  const user = await getUserWithOrg(userId);

  const product = await Product.findOne({
    where: { id, organizationId: user.organizationId },
    include: [
      { model: ProductImage, as: "images" },
      {
        model: ProductVariant,
        as: "variants",
        include: [{ model: VariantImage, as: "images" }],
      },
    ],
  });

  if (!product) throw new Error("Producto no encontrado");

  for (const img of product.images) {
    if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
  }

  for (const variant of product.variants) {
    for (const img of variant.images) {
      if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
    }
  }

  await product.destroy();
  return { message: "Producto eliminado permanentemente" };
};

/* ================= FILTER ================= */

const filterProducts = async (filters, userId) => {
  const user = await getUserWithOrg(userId);
  const { search, category, min, max, page = 1, limit = 10 } = filters;

  const where = { organizationId: user.organizationId };

  if (search) where.name = { [Op.iLike]: `%${search}%` };
  if (category) where.categoryId = category;
  if (min || max) {
    where.price = {};
    if (min) where.price[Op.gte] = +min;
    if (max) where.price[Op.lte] = +max;
  }

  const { count, rows } = await Product.findAndCountAll({
    where,
    limit: +limit,
    offset: (page - 1) * limit,
    include: [{ model: ProductImage, as: "images" }],
  });

  return { total: count, page: +page, results: rows };
};

module.exports = {
  filterProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  getProductById,
  getAllProd,
  getActiveProd,
};
