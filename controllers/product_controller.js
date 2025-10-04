const {Op } = require('sequelize');
const Product = require("../models/Product");
const User = require('../models/User')
const Category = require("../models/Category");
const { Result } = require('pg');
const cloudinary = require("../middlewares/cloudinary");

const getActiveProd = async () => {
    const products = await Product.findAll({
        where: {isActive: true},
        include: [{model: Category}]
    });

    return products;
}

const getAllProd = async (userId) => {
    
    const products = await Product.findAll({
        where: {
            userId,
        },
        include: [Category],
    });
    return products;
};

const createProduct = async (productData) => {
    const newProduct = await Product.create(productData);
    return newProduct;
};

const getProductById = async (id) => {
    const product = await Product.findByPk(id);
    return product;
};
const updateProduct = async (id, data, file) => {
    const product = await Product.findByPk(id);
    if (!product) throw new Error('Producto no encontrado');

    if (file) {
    if (product.public_id) {
      await cloudinary.uploader.destroy(product.public_id);
    }

    // Agrega la nueva imagen y public_id
    productData.image = file.path;
    productData.public_id = file.filename;
  }
    return await product.update(data);
}

const deleteProduct = async (id) => {
 const product = await Product.findByPk(id);
 if(!product) throw new Error("producto no encontrado");

 if (product.public_id) {
  await cloudinary.uploader.destroy(product.public_id);   
}

  await product.destroy();
 return { message : 'producto eliminado con exito'};
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

    // Ordenamiento
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