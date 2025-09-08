const Product = require("../models/Product");
const User = require('../models/User')
const Sell = require("../models/Sell");
const SellProduct = require("../models/SellProduct")

const createSell = async (userId, products) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error("products must be a non-empty array");
  }

  let totalAmount = 0;
  let numberOfProducts = 0;

  // Crear la venta primero
  const sell = await Sell.create({
    userId,
    status: "pendiente",
  });

  for (let p of products) {
    const product = await Product.findByPk(p.ProductId);

    if (!product) throw new Error(`Producto con id ${p.ProductId} no encontrado`);

    // Verificar que los IDs sean strings UUID válidos
    if (typeof sell.id !== "string" || typeof product.id !== "string") {
      throw new Error("Sell.id o Product.id no son UUID válidos");
    }

    const subtotal = Number(product.price) * p.quantity;
    totalAmount += subtotal;
    numberOfProducts += p.quantity;

    // Crear el registro en la tabla intermedia
    await SellProduct.create({
      SellId: sell.id,
      ProductId: product.id,
      quantity: p.quantity,
      price: product.price,
    });
  }

  // Actualizar totales de la venta
  sell.totalAmount = totalAmount;
  sell.numberOfProducts = numberOfProducts;
  await sell.save();

  return sell;
};


const confirmSell = async (sellId, userId) => {
    const sell = await Sell.findOne({where: {id:sellId, userId}});
    if(!sell) throw new Error("Venta no encontrada");

    if(sell.status === "concretada") throw new Error("La venta ya fue concretada anteriormente");

    const SellProducts = await SellProduct.findAll({where: {SellId: sell.id}});

    for(let sp of SellProducts){
        const product = await Product.findByPk(sp.ProductId);
        if(!product) continue;
        if(product.stock < sp.quantity){
            throw new Error(`Stock insuficiente de ${product.name}`);
        }
        product.stock -= sp.quantity;
        await product.save();
    }

    sell.status = "finalizado";
    sell.finishDate = new Date();
    await sell.save();

    return sell;
};

const getUserSells = async(userId) => {
    const sells = await Sell.findAll({
        where: {userId},
        include: [{model: Product}],
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
          through: {
            attributes: ["quantity", "price"], // datos de la tabla intermedia
          },
        },
      ],
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
  getSellById
};