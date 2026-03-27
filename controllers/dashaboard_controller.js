const Product = require("../models/Product");
const User = require("../models/User");
const Sell = require("../models/Sell");
const SellProduct = require("../models/SellProduct");
const { Op, fn, col, literal } = require("sequelize");


const buildScopeWhere = (scope = {}) => {
  if (scope.organizationId) return { organizationId: scope.organizationId };
  if (scope.userId) return { userId: scope.userId };
  return {};
};

const getSalesByDay = async (scope) => {
  const where = {
    status: "finalizado",
    finishDate: {
      [Op.between]: [
        new Date(new Date().setHours(0, 0, 0, 0)),
        new Date(new Date().setHours(23, 59, 59, 999)),
      ],
    },
    ...buildScopeWhere(scope),
  };

  return Sell.findAll({
    where,
    include: [{ model: SellProduct, as: "items" }],
    order: [["finishDate", "DESC"]],
  });
};

const getSalesByMonth = async (scope) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  return Sell.findAll({
    where: {
      status: "finalizado",
      finishDate: { [Op.between]: [start, end] },
      ...buildScopeWhere(scope),
    },
    include: [{ model: SellProduct, as: "items" }],
  });
};

const getSalesByWeek = async (scope) => {
  const now = new Date();
  const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
  const lastDay = new Date(now.setDate(firstDay.getDate() + 6));

  return Sell.findAll({
    where: {
      status: "finalizado",
      finishDate: { [Op.between]: [firstDay, lastDay] },
      ...buildScopeWhere(scope),
    },
    include: [{ model: SellProduct, as: "items" }],
  });
};

const getDashboardDataByDateRange = async (startDate, endDate, scope) => {
  const sells = await Sell.findAll({
    where: {
      status: "finalizado",
      finishDate: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      ...buildScopeWhere(scope),
    },
    include: [{ model: SellProduct, as: "items" }],
  });

  let totalSales = 0;
  sells.forEach(s => s.items.forEach(i => {
    totalSales += Number(i.price) * i.quantity;
  }));

  return { totalSales, totalSells: sells.length };
};

const getSalesByUser = async (scope) => {
  return Sell.findAll({
    where: {
      status: "finalizado",
      ...buildScopeWhere(scope),
    },
    include: [{ model: User, as: "user", attributes: ["id", "name"] }],
  });
};


const getTopSoldProducts = async (startDate, endDate, scope) => {
  const now = new Date();

  const start =
    startDate ||
    new Date(now.getFullYear(), now.getMonth(), 1);

  const end =
    endDate ||
    new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const whereSell = {
    status: "finalizado",
    finishDate: { [Op.between]: [start, end] },
    ...buildScopeWhere(scope),
  };

  return SellProduct.findAll({
    attributes: [
      "productId",
      [fn("SUM", col("SellProduct.quantity")), "totalSold"],
    ],

    include: [
      {
        model: Sell,
        as: "sell",
        attributes: [],
        where: whereSell,
        required: true,
      },
      {
        model: Product.unscoped(), // 🔥 rompe el defaultScope
        attributes: [
          "id",
          "name",
        ],
        required: true,
      },
    ],

    group: [
      "SellProduct.productId",
      "Product.id",
      "Product.name",
    ],

    order: [[literal('"totalSold"'), "DESC"]],

    limit: 10,

    subQuery: false,
    raw: true,
  });
};


const getLowStockProducts = async (threshold, scope) => {
  return Product.findAll({
    where: {
      stock: { [Op.lte]: threshold },
      ...buildScopeWhere(scope),
    },
  });
};

const getInventoryValue = async (scope) => {
  const products = await Product.findAll({
    where: buildScopeWhere(scope),
  });

  let total = 0;
  products.forEach(p => total += p.stock * p.buyPrice);

  return { inventoryValue: total };
};

const getProductProfit = async (startDate, endDate, scope) => {
  const sells = await Sell.findAll({
    where: {
      status: "finalizado",
      finishDate: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      ...buildScopeWhere(scope),
    },
    include: [{ model: SellProduct, as: "items" }],
  });

  let profit = 0;
  sells.forEach(s => s.items.forEach(i => {
    profit += (i.price - i.cost) * i.quantity;
  }));

  return { profit };
};

const getAllUsers = async () => {
  return User.findAll({
    attributes: ["id", "name", "email", "role", "createdAt"],
  });
};

const getNewUsersPerMonth = async () => {
  return User.findAll({ attributes: ["createdAt"] });
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
  getInventoryValue,
};