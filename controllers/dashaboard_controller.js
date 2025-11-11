const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const Sell = require("../models/Sell");
const SellProduct = require("../models/SellProduct");
const ProductImage = require("../models/ProductImage")
const ProductVariant = require("../models/ProductVariant")
const VariantImage = require("../models/VariantImage")
const { Op, fn, col, literal } = require("sequelize");

// === Ventas por día ===
const getSalesByDay = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const sales = await Sell.findAll({
    where: {
      status: "finalizado",
      finishDate: { [Op.between]: [startOfDay, endOfDay] },
    },
    include: [
      {
        model: SellProduct,
        as: "items",
        include: [{ model: Product, as: "product" }],
      },
      { model: User, as: "user", attributes: ["id", "name"] },
    ],
  });

  return sales;
};

// === Ventas por mes ===
const getSalesByMonth = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  const sales = await Sell.findAll({
    where: {
      status: "finalizado",
      finishDate: { [Op.between]: [startOfMonth, endOfMonth] },
    },
    include: [
      {
        model: SellProduct,
        as: "items",
        include: [{ model: Product, as: "product" }],
      },
      { model: User, as: "user", attributes: ["id", "name"] },
    ],
  });

  return sales;
};

// === Productos más vendidos ===
const getTopSoldProducts = async (startDate, endDate) => {
    const start = startDate
    ? new Date(startDate)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = endDate ? new Date(endDate) : new Date();

  try {
    // 1️⃣ Obtenemos el total de productos vendidos agrupando por ProductId
    const topData = await SellProduct.findAll({
      attributes: [
        "ProductId",
        [fn("SUM", col("quantity")), "totalSold"],
      ],
      where: {
        createdAt: { [Op.between]: [start, end] },
      },
      group: ["ProductId"],
      // 🔧 Usamos literal con comillas para evitar el error de alias
      order: [literal(`"totalSold" DESC`)],
      limit: 10,
      raw: true,
    });

    // 2️⃣ Traemos los productos completos con sus imágenes/variantes
    const productIds = topData.map((p) => p.ProductId);

    const products = await Product.findAll({
      where: { id: productIds },
      include: [
        { model: ProductImage, as: "images", attributes: ["url"] },
        {
          model: ProductVariant,
          as: "variants",
          attributes: ["color", "size", "stock", "price", "buyPrice"],
          include: [{ model: VariantImage, as: "images", attributes: ["url"] }],
        },
      ],
    });

    // 3️⃣ Combinamos los datos de ventas con la info de los productos
    const result = topData.map((item) => {
      const product = products.find((p) => p.id === item.ProductId);
      return {
        ...item,
        product,
      };
    });

    return result;
  } catch (error) {
    console.error("❌ Error en getTopSoldProducts:", error);
    throw error;
  }
};


// === Ventas agrupadas por usuario ===
const getSalesByUser = async () => {
  const sales = await Sell.findAll({
    where: { status: "finalizado" },
    include: [
      {
        model: SellProduct,
        as: "items",
        include: [{ model: Product, as: "product" }],
      },
      { model: User, as: "user", attributes: ["id", "name"] },
    ],
  });

  return sales;
};

// === Ventas por rango de fechas ===
const getDashboardDataByDateRange = async (startDate, endDate, userId) => {
  try {
    const whereCondition = {
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
    };

    if (userId) whereCondition.userId = userId;

    const sells = await Sell.findAll({
      where: whereCondition,
      include: [
        {
          model: SellProduct,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["name", "price", "buyPrice"],
            },
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    let totalSales = 0;
    let totalProfit = 0;
    let totalQuantity = 0;
    const dailyStats = {};

    sells.forEach((sell) => {
      const day = sell.createdAt.toISOString().split("T")[0];
      if (!dailyStats[day]) {
        dailyStats[day] = { sales: 0, profit: 0, quantity: 0 };
      }

      sell.items.forEach((item) => {
        const total = item.price * item.quantity;
        const profit = (item.price - item.product.buyPrice) * item.quantity;

        totalSales += total;
        totalProfit += profit;
        totalQuantity += item.quantity;

        dailyStats[day].sales += total;
        dailyStats[day].profit += profit;
        dailyStats[day].quantity += item.quantity;
      });
    });

    const dailyData = Object.entries(dailyStats).map(([date, data]) => ({
      date,
      ...data,
    }));

    return {
      totalSales,
      totalProfit,
      totalQuantity,
      totalSells: sells.length,
      range: { startDate, endDate },
      dailyData,
    };
  } catch (error) {
    console.error("❌ Error en getDashboardDataByDateRange:", error);
    throw error;
  }
};

module.exports = {
  getSalesByDay,
  getSalesByMonth,
  getTopSoldProducts,
  getSalesByUser,
  getDashboardDataByDateRange,
};
