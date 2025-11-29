const Product = require("../models/Product");
const User = require("../models/User");
const Sell = require("../models/Sell");
const SellProduct = require("../models/SellProduct");
const ProductImage = require("../models/ProductImage");
const ProductVariant = require("../models/ProductVariant");
const VariantImage = require("../models/VariantImage");
const { Op, fn, col, literal } = require("sequelize");


const getSalesByDay = async (userId = null) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const where = {
    status: "finalizado",
    finishDate: { [Op.between]: [startOfDay, endOfDay] },
    ...(userId && { userId })
  };

  const sales = await Sell.findAll({
    where,
    include: [
      {
        model: SellProduct,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            required: false,
            include: [
              { model: ProductImage, as: "images", required: false },
              { model: ProductVariant, as: "variants", required: false }
            ]
          }
        ]
      },
      { model: User, as: "user", attributes: ["id", "name"], required: !!userId }
    ],
    order: [["finishDate", "DESC"]]
  });

  return sales;
};


const getSalesByMonth = async (userId = null) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  const where = {
    status: "finalizado",
    finishDate: { [Op.between]: [startOfMonth, endOfMonth] },
    ...(userId && { userId })
  };

  const sales = await Sell.findAll({
    where,
    include: [
      {
        model: SellProduct,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            required: false,
            include: [
              { model: ProductImage, as: "images", required: false },
              { model: ProductVariant, as: "variants", required: false }
            ]
          }
        ]
      },
      { model: User, as: "user", attributes: ["id", "name"], required: !!userId }
    ],
    order: [["finishDate", "DESC"]]
  });

  return sales;
};

const getTopSoldProducts = async (startDate, endDate, userId = null) => {
  const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const end = endDate ? new Date(endDate) : new Date();

  const topData = await SellProduct.findAll({
    attributes: [
      "ProductId",
      [fn("SUM", col("quantity")), "totalSold"]
    ],
    include: [
      {
        model: Sell,
        as: "sell",
        attributes: [],
        where: {
          status: "finalizado",
          finishDate: { [Op.between]: [start, end] },
          ...(userId && { userId })
        }
      }
    ],
    group: ["ProductId"],
    order: [literal(`"totalSold" DESC`)],
    limit: 10,
    raw: true
  });

  const productIds = topData.map(p => p.ProductId);

  const products = await Product.findAll({
    where: { id: productIds, ...(userId && { userId }) },
    include: [
      { model: ProductImage, as: "images", attributes: ["url"], required: false },
      {
        model: ProductVariant,
        as: "variants",
        required: false,
        include: [{ model: VariantImage, as: "images", attributes: ["url"], required: false }]
      }
    ]
  });

  return topData.map(item => ({
    ...item,
    product: products.find(p => p.id === item.ProductId) || null
  }));
};

const getSalesByUser = async (userId) => {
  const where = {
    status: "finalizado",
    ...(userId && { userId })
  };

  const sales = await Sell.findAll({
    where,
    include: [
      {
        model: SellProduct,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            required: false,
            include: [
              { model: ProductImage, as: "images", required: false },
              { model: ProductVariant, as: "variants", required: false }
            ]
          }
        ]
      },
      { model: User, as: "user", attributes: ["id", "name"], required: !!userId }
    ],
    order: [["finishDate", "DESC"]]
  });

  return sales;
};

const getDashboardDataByDateRange = async (startDate, endDate, userId = null) => {
  const where = {
    status: "finalizado",
    finishDate: { [Op.between]: [new Date(startDate), new Date(endDate)] },
    ...(userId && { userId })
  };

  const sells = await Sell.findAll({
    where,
    include: [
      {
        model: SellProduct,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            required: false,
            attributes: ["name", "price", "buyPrice"],
          }
        ]
      }
    ],
    order: [["finishDate", "ASC"]]
  });

  let totalSales = 0;
  let totalProfit = 0;
  let totalQuantity = 0;
  const dailyStats = {};

  sells.forEach(sell => {
    const day = sell.finishDate.toISOString().split("T")[0];
    if (!dailyStats[day]) dailyStats[day] = { sales: 0, profit: 0, quantity: 0 };

    sell.items.forEach(item => {
      const total = Number(item.price) * item.quantity;
      const buy = Number(item.product?.buyPrice || 0);
      const profit = (Number(item.price) - buy) * item.quantity;

      totalSales += total;
      totalProfit += profit;
      totalQuantity += item.quantity;

      dailyStats[day].sales += total;
      dailyStats[day].profit += profit;
      dailyStats[day].quantity += item.quantity;
    });
  });

  const dailyData = Object.entries(dailyStats).map(([date, data]) => ({ date, ...data }));

  return {
    totalSales,
    totalProfit,
    totalQuantity,
    totalSells: sells.length,
    range: { startDate, endDate },
    dailyData
  };
};

const getSalesByWeek = async (userId = null) => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);

  const startOfWeek = new Date(now.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const where = {
    status: "finalizado",
    finishDate: { [Op.between]: [startOfWeek, endOfWeek] },
    ...(userId && { userId })
  };

  const sales = await Sell.findAll({
    where,
    include: [
      {
        model: SellProduct,
        as: "items",
        include: [
          { model: Product, as: "product" }
        ]
      }
    ],
    order: [["finishDate", "DESC"]]
  });

  return sales;
};


const getAllUsers = async () => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "businessName", "role", "createdAt"],
    order: [["createdAt", "DESC"]],
  });

  return users;
};

const getLowStockProducts = async (threshold = 5, userId = null) => {
  const where = {
    stock: { [Op.lte]: threshold },
    ...(userId && { userId })
  };

  const products = await Product.findAll({
    where,
    include: [
      {
        model: ProductVariant,
        as: "variants",
        required: false
      }
    ],
    order: [["stock", "ASC"]]
  });

  return products;
};

const getProductProfit = async (startDate, endDate, userId = null) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Las fechas proporcionadas no son válidas");
  }

  const sells = await Sell.findAll({
    where: {
      status: "finalizado",
      finishDate: { [Op.between]: [start, end] },
      ...(userId && { userId })
    },
    include: [
      {
        model: SellProduct,
        as: "items",
        include: [
          { model: Product, as: "product", attributes: ["name", "buyPrice"] }
        ]
      }
    ]
  });

  const profitMap = {};

  sells.forEach(sell => {
    sell.items.forEach(item => {
      const pid = item.ProductId;

      if (!profitMap[pid]) {
        profitMap[pid] = {
          productId: pid,
          name: item.product?.name || "N/A",
          quantity: 0,
          revenue: 0,
          profit: 0
        };
      }

      const revenue = Number(item.price) * item.quantity;
      const buy = Number(item.product?.buyPrice || 0);
      const profit = (Number(item.price) - buy) * item.quantity;

      profitMap[pid].quantity += item.quantity;
      profitMap[pid].revenue += revenue;
      profitMap[pid].profit += profit;
    });
  });

  return Object.values(profitMap).sort((a, b) => b.profit - a.profit);
};

const getNewUsersPerMonth = async () => {
  const users = await User.findAll({
    attributes: ["id", "createdAt"],
    order: [["createdAt", "ASC"]]
  });

  const stats = {};

  users.forEach(user => {
    const date = new Date(user.createdAt);
    const key = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    if (!stats[key]) stats[key] = 0;
    stats[key]++;
  });

  return stats;
};

const getInventoryValue = async (userId = null) => {
  const where = {
    ...(userId && { userId })
  };

  const products = await Product.findAll({ where });

  let totalUnits = 0;
  let totalBuyValue = 0;
  let totalSellValue = 0;

  products.forEach(p => {
    const qty = Number(p.stock);
    const buy = Number(p.buyPrice || 0);
    const sell = Number(p.price || 0);

    totalUnits += qty;
    totalBuyValue += qty * buy;
    totalSellValue += qty * sell;
  });

  return {
    totalUnits,
    totalBuyValue,
    totalSellValue,
    projectedProfit: totalSellValue - totalBuyValue
  };
};

module.exports = {
  getSalesByDay,
  getSalesByMonth,
  getTopSoldProducts,
  getSalesByUser,
  getDashboardDataByDateRange,
  getAllUsers,
  getLowStockProducts,
  getSalesByWeek,
  getProductProfit,
  getNewUsersPerMonth,
  getInventoryValue
};

