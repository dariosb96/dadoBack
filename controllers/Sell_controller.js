const Product = require("../models/Product");
const User = require('../models/User')
const Sell = require("../models/Sell");
const SellProduct = require("../models/SellProduct")
const ProductImage = require("../models/ProductImage")
const ProductVariant = require("../models/ProductVariant");

// const createSell = async (userId, products) => {
//   if (!Array.isArray(products) || products.length === 0) {
//     throw new Error("products must be a non-empty array");
//   }

//   return await Sell.sequelize.transaction(async (t) => {
//     let totalAmount = 0;
//     let numberOfProducts = 0;

//     const sell = await Sell.create(
//       { userId, status: "pendiente" },
//       { transaction: t }
//     );

//     for (let p of products) {
//       const product = await Product.findByPk(p.ProductId, { transaction: t });
//       if (!product) throw new Error(`Producto con id ${p.ProductId} no encontrado`);

//       if (product.stock < p.quantity) {
//         throw new Error(
//           `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, solicitado: ${p.quantity}`
//         );
//       }

//       const subtotal = Number(product.price) * p.quantity;
//       totalAmount += subtotal;
//       numberOfProducts += p.quantity;

//       await product.update(
//         { stock: product.stock - p.quantity },
//         { transaction: t }
//       );

//       await SellProduct.create(
//         {
//           SellId: sell.id,
//           ProductId: product.id,
//           quantity: p.quantity,
//           price: product.price,
//         },
//         { transaction: t }
//       );
//     }

//     await sell.update({ totalAmount, numberOfProducts }, { transaction: t });

//     return {
//       ...sell.toJSON(),
//       totalAmount,
//       numberOfProducts,
//     };
//   });
// };

const createSell = async (userId, products) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("products must be a non-empty array");
  }

  return await Sell.sequelize.transaction(async (t) => {
    let totalAmount = 0;
    let numberOfProducts = 0;

    const sell = await Sell.create(
      { userId, status: "pendiente" },
      { transaction: t }
    );

    for (let p of products) {
      const product = await Product.findByPk(p.ProductId, { transaction: t });
      if (!product) throw new Error(`Producto con id ${p.ProductId} no encontrado`);

      const stockDisponible = product.stock - product.reserved;

      if (stockDisponible < p.quantity) {
        throw new Error(
          `Stock insuficiente para ${product.name}. Disponible: ${stockDisponible}, solicitado: ${p.quantity}`
        );
      }

      const subtotal = Number(product.price) * p.quantity;
      totalAmount += subtotal;
      numberOfProducts += p.quantity;

      await product.update(
        { reserved: product.reserved + p.quantity },
        { transaction: t }
      );

      await SellProduct.create(
        {
          SellId: sell.id,
          ProductId: product.id,
          quantity: p.quantity,
          price: product.price,
        },
        { transaction: t }
      );
    }

    await sell.update({ totalAmount, numberOfProducts }, { transaction: t });

    return {
      ...sell.toJSON(),
      totalAmount,
      numberOfProducts,
    };
  });
};
const cancelSell = async (sellId, userId) => {
  return await Sell.sequelize.transaction(async (t) => {
    const sell = await Sell.findOne({
      where: { id: sellId, userId },
      transaction: t,
    });

    if (!sell) throw new Error("Venta no encontrada");
    if (sell.status !== "pendiente")
      throw new Error("Solo puedes cancelar ventas pendientes");

    const SellProducts = await SellProduct.findAll({
      where: { SellId: sell.id },
      transaction: t,
    });

    for (let sp of SellProducts) {
      const product = await Product.findByPk(sp.ProductId, { transaction: t });

      if (!product) continue;

      await product.update(
        {
          reserved: product.reserved - sp.quantity,
        },
        { transaction: t }
      );
    }

    await sell.destroy({ transaction: t });

    return { message: "Venta cancelada y stock liberado" };
  });
};



const confirmSell = async (sellId, userId) => {
  return await Sell.sequelize.transaction(async (t) => {
    const sell = await Sell.findOne({
      where: { id: sellId, userId },
      transaction: t,
    });

    if (!sell) throw new Error("Venta no encontrada");
    if (sell.status !== "pendiente")
      throw new Error("Solo puedes confirmar ventas pendientes");

    const SellProducts = await SellProduct.findAll({
      where: { SellId: sell.id },
      transaction: t,
    });

    for (let sp of SellProducts) {
      const product = await Product.findByPk(sp.ProductId, {
        transaction: t,
      });

      if (!product) continue;

      if (product.reserved < sp.quantity) {
        throw new Error(
          `Error de integridad: reserved menor a lo vendido en ${product.name}`
        );
      }
      await product.update(
        {
          stock: product.stock - sp.quantity,
          reserved: product.reserved - sp.quantity,
        },
        { transaction: t }
      );
    }
    await sell.update(
      {
        status: "finalizado",
        finishDate: new Date(),
      },
      { transaction: t }
    );
    return sell;
  });
};


const getUserSells = async(userId) => {
   const sells = await Sell.findAll({
  where: { userId },
  include: [
    {
      model: Product,
      as: "products",
      through: { attributes: ["quantity", "price"] },
    },
  ],
  order: [["createdAt", "DESC"]],
});


    return sells;
}

const getSellById = async (id) => {
  try {
    const sell = await Sell.findByPk(id, {
      include: [
        {
          model: Product,
          as: "products", // 🔥 IMPORTANTE
          through: {
            model: SellProduct,
            attributes: ["quantity", "price"],
          },
          include: [
            {
              model: ProductImage,
              as: "images",
            },
            {
              model: ProductVariant,
              as: "variants",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!sell) {
      throw new Error("Venta no encontrada");
    }
    return sell;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createSell,
  confirmSell,
  getUserSells,
  getSellById,
  cancelSell
};
