const Product = require("../models/Product");
const User = require("../models/User");
const Sell = require("../models/Sell");
const SellProduct = require("../models/SellProduct");
const ProductVariant = require("../models/ProductVariant");

const getUserWithOrg = async (userId, transaction = null) => {
  const user = await User.findByPk(userId, { transaction });
  if (!user) throw new Error("Usuario no encontrado");
  if (!user.organizationId) throw new Error("Usuario sin organización");
  return user;
};


const createSell = async (userId, products) => {
  if (!Array.isArray(products) || products.length === 0)
    throw new Error("products must be a non-empty array");

  return Sell.sequelize.transaction(async (t) => {
    const user = await getUserWithOrg(userId, t);

    let totalAmount = 0;
    let totalProfit = 0;
    let numberOfProducts = 0;

    const sell = await Sell.create(
      {
        userId,
        organizationId: user.organizationId,
        status: "pendiente",
      },
      { transaction: t }
    );

    for (const p of products) {
      if (!p.quantity || p.quantity <= 0)
        throw new Error("Cantidad inválida");

      let product;
      let variant;

      /* ========= VARIANTE ========= */
      if (p.variantId) {
        variant = await ProductVariant.findOne({
          where: { id: p.variantId },
          include: {
            model: Product,
            where: { organizationId: user.organizationId },
          },
          transaction: t,
        });

        if (!variant) throw new Error("Variante no encontrada");

        product = variant.Product;
      }

      /* ========= PRODUCTO BASE ========= */
 /* ========= PRODUCTO BASE ========= */
else if (p.productId) {
  product = await Product.findOne({
    where: {
      id: p.productId,
      organizationId: user.organizationId,
    },
    transaction: t,
  });

  if (!product) throw new Error("Producto no encontrado");
}

/* ========= NINGUNO ========= */
else {
  throw new Error("Debes enviar productId o variantId");
}


      const stock = variant ? variant.stock : product.stock;
      const reserved = variant
        ? variant.reserved || 0
        : product.reserved || 0;

      if (stock - reserved < p.quantity)
        throw new Error(`Stock insuficiente para ${product.name}`);

      /* ========= PRECIOS ========= */

      const sellPrice = variant?.price ?? product.price;
      const buyPrice = variant?.buyPrice ?? product.buyPrice;

      const finalPrice =
        p.finalPrice !== undefined
          ? Number(p.finalPrice)
          : Number(sellPrice);

      const profit = (finalPrice - buyPrice) * p.quantity;

      totalAmount += finalPrice * p.quantity;
      totalProfit += profit;
      numberOfProducts += p.quantity;

      /* ========= RESERVAR STOCK ========= */

      if (variant) {
        await variant.update(
          { reserved: reserved + p.quantity },
          { transaction: t }
        );
      } else {
        await product.update(
          { reserved: reserved + p.quantity },
          { transaction: t }
        );
      }

      /* ========= SNAPSHOT ========= */

      await SellProduct.create(
        {
          SellId: sell.id,
          productId: product.id,
          variantId: variant?.id || null,
          name: product.name,
          color: variant?.color || null,
          size: variant?.size || null,
          price: finalPrice,
          buyPrice,
          quantity: p.quantity,
        },
        { transaction: t }
      );
    }

    await sell.update(
      {
        totalAmount,
        totalProfit,
        numberOfProducts,
      },
      { transaction: t }
    );

    return sell;
  });
};

const confirmSell = async (sellId, userId) => {
  return Sell.sequelize.transaction(async (t) => {
    const user = await getUserWithOrg(userId, t);

    const sell = await Sell.findOne({
      where: { id: sellId, organizationId: user.organizationId },
      include: { model: SellProduct, as: "items" },
      transaction: t,
    });

    if (!sell) throw new Error("Venta no encontrada");
    if (sell.status !== "pendiente")
      throw new Error("Solo puedes confirmar ventas pendientes");

    for (const sp of sell.items) {
      if (sp.variantId) {
        const variant = await ProductVariant.findByPk(sp.variantId, {
          transaction: t,
        });

        await variant.update(
          {
            stock: variant.stock - sp.quantity,
            reserved: Math.max(0, variant.reserved - sp.quantity),
          },
          { transaction: t }
        );
      } else {
        const product = await Product.findByPk(sp.productId, {
          transaction: t,
        });

        await product.update(
          {
            stock: product.stock - sp.quantity,
            reserved: Math.max(0, product.reserved - sp.quantity),
          },
          { transaction: t }
        );
      }
    }

    await sell.update(
      { status: "finalizado", finishDate: new Date() },
      { transaction: t }
    );

    return sell;
  });
};


const cancelSell = async (sellId, userId) => {
  return Sell.sequelize.transaction(async (t) => {
    const user = await getUserWithOrg(userId, t);

    const sell = await Sell.findOne({
      where: { id: sellId, organizationId: user.organizationId },
      include: { model: SellProduct, as: "items" },
      transaction: t,
    });

    if (!sell) throw new Error("Venta no encontrada");
    if (sell.status !== "pendiente")
      throw new Error("Solo puedes cancelar ventas pendientes");

    for (const sp of sell.items) {
      if (sp.variantId) {
        const variant = await ProductVariant.findByPk(sp.variantId, {
          transaction: t,
        });

        await variant.update(
          {
            reserved: Math.max(0, variant.reserved - sp.quantity),
          },
          { transaction: t }
        );
      } else {
        const product = await Product.findByPk(sp.productId, {
          transaction: t,
        });

        await product.update(
          {
            reserved: Math.max(0, product.reserved - sp.quantity),
          },
          { transaction: t }
        );
      }
    }

    await sell.destroy({ transaction: t });

    return { message: "Venta cancelada y stock liberado" };
  });
};


const getUserSells = async (userId) => {
  const user = await getUserWithOrg(userId);

  return Sell.findAll({
    where: { organizationId: user.organizationId },
    include: {
      model: SellProduct,
      as: "items",
    },
    order: [["createdAt", "DESC"]],
  });
};


const getSellById = async (sellId, userId) => {
  const user = await getUserWithOrg(userId);

  const sell = await Sell.findOne({
    where: {
      id: sellId,
      organizationId: user.organizationId,
    },
    include: {
      model: SellProduct,
      as: "items",
    },
  });

  if (!sell) throw new Error("Venta no encontrada");

  return sell;
};


const deleteSell = async (sellId, userId) => {
  return Sell.sequelize.transaction(async (t) => {
    const user = await getUserWithOrg(userId, t);

    const sell = await Sell.findOne({
      where: {
        id: sellId,
        organizationId: user.organizationId,
      },
      transaction: t,
    });

    if (!sell) throw new Error("Venta no encontrada");
    if (sell.status !== "pendiente")
      throw new Error("Solo puedes eliminar ventas pendientes");

    await sell.destroy({ transaction: t });

    return { message: "Venta eliminada" };
  });
};

module.exports = {
  createSell,
  confirmSell,
  cancelSell,
  getUserSells,
  getSellById,
  deleteSell
};
