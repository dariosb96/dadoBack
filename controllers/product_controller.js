const {Op } = require('sequelize');
const Product = require("../models/Product");
const User = require('../models/User')
const Category = require("../models/Category");
const ProductImage = require("../models/ProductImage")
const { Result } = require('pg');
const cloudinary = require("../middlewares/cloudinary");

const getActiveProd = async () => {
    const products = await Product.findAll({
        where: {isActive: true},
        include: [
          {model: Category},
          {model:ProductImage, as:"images"}

        ]
    });

    return products;
}

const getAllProd = async (userId) => {
    
    const products = await Product.findAll({
        where: {
            userId,
        },
        include: [
        { model: Category },
        { model: ProductImage, as: "images" } 
      ],
    });
    return products;
};

const createProduct = async ({ name, description, buyPrice, price, stock, categoryId, userId, files }) => {

  const newProduct = await Product.create({
    name,
    description,
    buyPrice,
    price,
    stock,
    categoryId,
    userId,
  });

  if (files && files.length > 0) {
    const imagesData = files.map((file) => ({
      url: file.path,
      public_id: file.filename,
      productId: newProduct.id,
    }));

    await ProductImage.bulkCreate(imagesData);
  }
  const productWithImages = await Product.findByPk(newProduct.id, {
    include: [{ model: ProductImage, as: "images" }],
  });

  return productWithImages;
};

const getProductById = async (id) => {
    const product = await Product.findByPk(id);
    return product;
};
const updateProduct = async (id, data) => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Producto no encontrado");

  if (data.imagesToDelete) {
    const ids = Array.isArray(data.imagesToDelete) ? data.imagesToDelete : [data.imagesToDelete];
    for (const public_id of ids) {
      await cloudinary.uploader.destroy(public_id);
      await ProductImage.destroy({ where: { public_id } });
    }
  }

  if (data.files && data.files.length > 0) {
    const newImages = data.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
      productId: id,
    }));
    await ProductImage.bulkCreate(newImages);
  }

  await product.update({
    name: data.name,
    description: data.description,
    buyPrice: data.buyPrice,
    price: data.price,
    stock: data.stock,
  });

  const updated = await Product.findByPk(id, {
    include: [{ model: ProductImage, as: "images" }],
  });

  return updated;
};


const deleteProduct = async (id) => {
  const product = await Product.findByPk(id, {
    include: { model: ProductImage, as: "images" },
  });
  if (!product) throw new Error("Producto no encontrado");

  for (const img of product.images) {
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
    }
  }

  await product.destroy();
  return { message: "Producto eliminado con éxito" };
};

const filterProducts = async (filters) => {
    const { search, category, min, max, page = 1, limit = 10, sort = "name_asc" } = filters;

    const where = {};
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (min || max) {
        where.price = {};
        if (min) where.price[Op.gte] = min;
        if (max) where.price[Op.lte] = max;
    }
    if (category) where.categoryId = category;

    const offset = (page - 1) * limit;

    let order = [["name", "ASC"]];
    if (sort === "price_desc") order = [["price", "DESC"]];
    if (sort === "price_asc") order = [["price", "ASC"]];
    if (sort === "name_desc") order = [["name", "DESC"]];

    const products = await Product.findAndCountAll({
        where,
        include: Category,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order,
    });

    return {
        total: products.count,
        page: parseInt(page),
        totalPages: Math.ceil(products.count / limit),
        results: products.rows,
    };
};

const isUUID = (str) =>
  typeof str === "string" &&
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    str
  );

const getPublicCatalogByUser = async (userId, category) => {
  
  const where = { userId, isActive: true };
 
  if (category) {
    if (isUUID(category)) {
      where.categoryId = category;
    } else {

      const matchedCategories = await Category.findAll({
        where: { name: { [Op.iLike]: `%${category}%` } },
        attributes: ["id", "name"],
      });


      if (!matchedCategories.length) {
       
        return { businessName: null, products: [] };
      }

      const ids = matchedCategories.map((c) => c.id);
      where.categoryId = { [Op.in]: ids };
          }
  }

  const products = await Product.findAll({
    where,
    include: [
      { model: Category, attributes: ["id", "name"] },
      { model: User, attributes: ["businessName"] },
      { model: ProductImage, as: "images" } 
    ],
  });

  if (!products.length) {
    return { businessName: null, products: [] };
  }

  return {
    businessName: products[0].User?.businessName || null,
    products,
  };
};



const getPublicCatalogs = async () => {
  const users = await User.findAll({
    attributes: ["id", "businessName"], 
    include: [
      {
        model: Product,
        attributes: ["id", "name", "price", "isActive", "categoryId"],
        where: { isActive: true },
        include: [
          {
            model: Category,
            attributes: ["id", "name"]
          }
        ]
      }
    ]
  });

  return users;
};

module.exports = {
    getAllProd,
    createProduct,
    deleteProduct,
    updateProduct,
    getProductById,
    filterProducts,
    getActiveProd,
    getPublicCatalogByUser,
    getPublicCatalogs
}