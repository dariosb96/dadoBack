const { Op } = require("sequelize");
const Product = require("../models/Product");
const User = require("../models/User");
const Category = require("../models/Category");
const ProductImage = require("../models/ProductImage");
const ProductVariant = require("../models/ProductVariant");
const VariantImage = require("../models/VariantImage")
const cloudinary = require("../middlewares/cloudinary");
const PDFDocument =require("pdfkit");
const axios = require("axios");
const fs = require("fs");
const os = require("os");
const path = require("path");

const getActiveProd = async () => {
  const products = await Product.findAll({
    where: { isActive: true },
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
  return products;
};

const getAllProd = async (userId) => {
  const products = await Product.findAll({
    where: { userId },
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
  return products;
};


const createProduct = async ({ name, description, color, buyPrice, price, stock, categoryId, userId, variants }, files = {}) => {

  const product = await Product.create({
    name,
    description,
    color,
    buyPrice,
    price,
    stock,
    categoryId,
    userId,
  });

  const productFiles = files.images || [];
  if (productFiles.length > 0) {
    const imagesData = productFiles.map((file) => ({
      productId: product.id,
      url: file.path || file.location || file.filename,
      public_id: file.filename || null,
    }));
    await ProductImage.bulkCreate(imagesData);
  }

  for (let i = 0; i < (variants?.length || 0); i++) {
    const v = variants[i];

    const variantPrice = v.price != null && v.price !== "" ? v.price : product.price;
    const variantBuyPrice = v.buyPrice != null && v.buyPrice !== "" ? v.buyPrice : product.buyPrice;


    const newVariant = await ProductVariant.create({
      productId: product.id,
      color: v.color || null,
      size: v.size || null,
      stock: v.stock ?? 0,
      price: variantPrice,
      buyPrice: variantBuyPrice,
    });

    const variantFiles = files[`variantImages_${i}`] || [];
    if (variantFiles.length > 0) {
      const variantImagesData = variantFiles.map((file) => ({
        variantId: newVariant.id,
        url: file.path || file.location || file.filename,
        public_id: file.filename || null,
      }));
      await VariantImage.bulkCreate(variantImagesData);
    }
  }

  return await Product.findByPk(product.id, {
    include: [
      { model: ProductImage, as: "images" },
      {
        model: ProductVariant,
        as: "variants",
        include: [{ model: VariantImage, as: "images" }],
      },
      { model: Category, as: "Category" },
    ],
  });
};


const getProductById = async (id) => {
  const product = await Product.findByPk(id, {
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
  return product;
};


const updateProduct = async (req) => {
  const { id } = req.params;

  const product = await Product.findByPk(id, {
    include: [
      { model: ProductImage, as: "images" },
      { model: ProductVariant, as: "variants", include: { model: VariantImage, as: "images" } },
    ],
  });

  if (!product) throw new Error("Producto no encontrado");

  const data = req.body;

  const files = req.files ? Object.values(req.files).flat() : [];
  const filesByField = req.filesByField || {};

  if (data.imagesToDelete) {
    let imagesToDelete = data.imagesToDelete;
    if (typeof imagesToDelete === "string") {
      try {
        imagesToDelete = JSON.parse(imagesToDelete);
      } catch (err) {
        imagesToDelete = [imagesToDelete];
      }
    }
    if (!Array.isArray(imagesToDelete)) imagesToDelete = [imagesToDelete];

    const imgsToDelete = await ProductImage.findAll({ where: { id: imagesToDelete } });
    for (const img of imgsToDelete) {
      await cloudinary.uploader.destroy(img.public_id);
      await img.destroy();
    }
  }

  const mainImages = filesByField.images || [];
  if (mainImages.length) {
    const imgs = mainImages.map((file) => ({
      url: file.path,
      public_id: file.filename,
      productId: product.id,
    }));
    await ProductImage.bulkCreate(imgs);
  }

  if (data.removedVariantIds) {
    let removedIds = data.removedVariantIds;
    if (typeof removedIds === "string") {
      try {
        removedIds = JSON.parse(removedIds);
      } catch (err) {
        removedIds = [removedIds];
      }
    }
    if (!Array.isArray(removedIds)) removedIds = [removedIds];
    await VariantImage.destroy({ where: { variantId: removedIds } });
    await ProductVariant.destroy({ where: { id: removedIds } });
  }

  if (data.variants) {
    const variants = typeof data.variants === "string" ? JSON.parse(data.variants) : data.variants;

    for (const variantData of variants) {
      const { uid, id: variantId, color, size, stock, price, buyPrice, removedImageIds } = variantData;

      let variant;
      if (variantId) {
        variant = await ProductVariant.findByPk(variantId);
        if (!variant) continue;
        await variant.update({ color, size, stock, price, buyPrice });
      } else {
        variant = await ProductVariant.create({ productId: id, color, size, stock, price, buyPrice });
      }

      // Eliminar imágenes viejas de la variante
      if (removedImageIds && removedImageIds.length) {
        await VariantImage.destroy({ where: { id: removedImageIds } });
      }

      // Agregar nuevas imágenes
      const variantFiles = filesByField[`variantImages_${uid}`] || [];
      if (variantFiles.length) {
        const imgs = variantFiles.map((file) => ({
          url: file.path,
          public_id: file.filename,
          variantId: variant.id,
        }));
        await VariantImage.bulkCreate(imgs);
      }
    }
  }

  await product.update({
    name: data.name,
    description: data.description,
    color: data.color,
    buyPrice: data.buyPrice,
    price: data.price,
    stock: data.stock,
    categoryId: data.categoryId,
  });

  const updated = await Product.findByPk(id, {
    include: [
      { model: ProductImage, as: "images" },
      { model: ProductVariant, as: "variants", include: { model: VariantImage, as: "images" } },
    ],
  });

  return updated;
};


const deleteProduct = async (id) => {
  const product = await Product.findByPk(id, {
    include: [
      { model: ProductImage, as: "images" },
      { model: ProductVariant, as: "variants" },
    ],
  });
  if (!product) throw new Error("Producto no encontrado");

  for (const img of product.images) {
    if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
  }

  await ProductVariant.destroy({ where: { productId: id } });
  await product.destroy();
  return { message: "Producto eliminado con éxito" };
};

const filterProducts = async (filters) => {
  const { search, category, min, max, page = 1, limit = 10, sort = "name_asc" } =
    filters;

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
    include: [
      Category,
      { model: ProductImage, as: "images" },
      { model: ProductVariant, as: "variants" },
    ],
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
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(str);

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
      { model: User, attributes: ["businessName", "phone"] },
      { model: ProductImage, as: "images" },
{ model: ProductVariant, as: "variants", include: { model: VariantImage, as: "images" } }
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
        attributes: ["id", "name","color", "price", "isActive", "categoryId"],
        where: { isActive: true },
        include: [
          { model: Category, attributes: ["id", "name"] },
          { model: ProductVariant, as: "variants" },
        ],
      },
    ],
  });

  return users;
};



async function downloadImageToTemp(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });

    const tmpPath = path.join(
      os.tmpdir(),
      `img_${Date.now()}_${Math.random()}.jpg`
    );

    fs.writeFileSync(tmpPath, response.data);

    return tmpPath;
  } catch (err) {
    console.error("❌ Error descargando imagen:", err.message);
    return null; 
  }
}


const generateCatalogPDF = async ({ userId, includePhone = true, includeBusinessName = true, includeOwnerName = true, res }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("Usuario no encontrado");

  const products = await Product.findAll({
    where: { userId, isActive: true },
    include: [{ model: ProductImage, as: "images" }],
    order: [["name", "ASC"]],
  });

  if (!products.length) throw new Error("No hay productos activos");

  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: 40, bottom: 50, left: 40, right: 40 }
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=catalogo.pdf");

  doc.pipe(res);

  // ===== ENCABEZADO =====
  doc.font("Helvetica-Bold").fontSize(24);

  let title = "";
  if (includeBusinessName && user.businessName) title += user.businessName.toUpperCase();
  if (!title) title = "CATÁLOGO DE PRODUCTOS";

  doc.text(title, { align: "center" });

  doc.moveDown(0.3);
  doc.font("Helvetica").fontSize(12);

  let sub = "";
  if (includeOwnerName) sub += `Propietario: ${user.name}   `;
  if (includePhone && user.phone) sub += `Tel: ${user.phone}`;

  if (sub.trim()) doc.text(sub, { align: "center" });

  doc.moveDown(1.5);

  // ===== TARJETAS =====
  const cardWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const cardHeight = 190;
  const padding = 15;
  const imgSize = 130;

  for (const p of products) {
    let startY = doc.y;

    // crear nueva pagina si no cabe
    if (startY + cardHeight > doc.page.height - doc.page.margins.bottom - 10) {
      doc.addPage();
      startY = doc.y;
    }

    const startX = doc.page.margins.left;

    // fondo card
    doc.save()
      .roundedRect(startX, startY, cardWidth, cardHeight, 10)
      .fillOpacity(0.08)
      .fill("#4B0082")
      .restore();

    // imagen
    const imgX = startX + padding;
    const imgY = startY + padding;

    const firstImage = p.images?.length ? p.images[0].url : null;

    if (firstImage) {
      const tmp = await downloadImageToTemp(firstImage);
      if (tmp) {
        try {
          doc.image(tmp, imgX, imgY, { fit: [imgSize, imgSize] });
        } catch {
          doc.fontSize(10).fillColor("red").text("Imagen no disponible", imgX, imgY + imgSize / 2);
        }
      } else {
        doc.fontSize(10).fillColor("red").text("Imagen no disponible", imgX, imgY + imgSize / 2);
      }
    } else {
      doc.fontSize(10).fillColor("red").text("Sin imagen", imgX, imgY + imgSize / 2);
    }

    const textX = imgX + imgSize + padding;
    let textY = startY + padding;

    doc.font("Helvetica-Bold").fontSize(16).fillColor("#000")
      .text(p.name, textX, textY, { width: cardWidth - imgSize - padding * 3 });

    textY += 25;

    doc.font("Helvetica").fontSize(12);
    doc.text(`Precio: $${p.price}`, textX, textY); textY += 18;

    if (p.stock !== undefined) {
      doc.text(`Stock: ${p.stock}`, textX, textY);
      textY += 18;
    }

    if (p.description) {
      doc.fontSize(10).fillColor("#333")
        .text(p.description, textX, textY, { width: cardWidth - imgSize - padding * 3 });
    }
    doc.y = startY + cardHeight + 22;
  }

  doc.end();
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
  getPublicCatalogs,
  generateCatalogPDF
};
