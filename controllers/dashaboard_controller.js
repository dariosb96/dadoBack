const Product = require("../models/Product")
const Category = require("../models/Category");
const User = require("../models/User")
const Sell = require("../models/Sell");
const SellProduct = require("../models/SellProduct")

const { Op, fn, col, literal}= require('sequelize');

const getDashBoard = async () => {
    const totalProducts = await Product.count();
    const totalCategories = await Category.count();
    const totalStock = await Product.sum('stock');

    const products = await Product.findAll({
        attributes: ['price', 'buyPrice', 'stock']
    });

    let estimateProfit = 0;
    products.forEach(p => {
        estimateProfit += (p.price - p.buyPrice) * p.stock;
    });

    const topProducts = await Product.findAll({
        limit: 5,
        order: [['stock', 'DESC']],
        attributes: ['name', 'stock']
    });

    return {
        totalProducts,
        totalCategories,
        totalStock,
        estimateProfit,
        topProducts
    };
};

const getSalesByDay = async () => {
  const sales = await SellProduct.findAll({
    include: [
      {
        model: Sell,
        where: { status: "finalizado" },
        attributes: [],
      },
      {
        model: Product,
        attributes: [],
      },
    ],
    attributes: [
      [fn("DATE", col("Sell.creationDate")), "day"],
      [fn("COUNT", col("Sell.id")), "salesCount"],
      [fn("SUM", col("Sell.totalAmount")), "totalSales"],
      [
        fn(
          "SUM",
          literal(
            `("Product"."price" - "Product"."buyPrice") * "SellProduct"."quantity"`
          )
        ),
        "profit",
      ],
    ],
    group: [fn("DATE", col("Sell.creationDate"))], // 👈 importante
    order: [[fn("DATE", col("Sell.creationDate")), "ASC"]],
    raw: true,
  });

  return sales;
};

// Ventas agrupadas por mes
const getSalesByMonth = async () => {
  const sales = await SellProduct.findAll({
    include: [
      {
        model: Sell,
        where: { status: "finalizado" },
        attributes: [],
      },
      {
        model: Product,
        attributes: [],
      },
    ],
    attributes: [
      [
        fn(
          "TO_CHAR",
          col("Sell.creationDate"),
          "YYYY-MM"
        ),
        "month",
      ],
      [fn("COUNT", col("Sell.id")), "salesCount"],
      [fn("SUM", col("Sell.totalAmount")), "totalSales"],
      [
        fn(
          "SUM",
          literal(
            `("Product"."price" - "Product"."buyPrice") * "SellProduct"."quantity"`
          )
        ),
        "profit",
      ],
    ],
    group: [
      fn("TO_CHAR", col("Sell.creationDate"), "YYYY-MM") // 👈 se agrega al GROUP BY
    ],
    order: [
      [fn("TO_CHAR", col("Sell.creationDate"), "YYYY-MM"), "ASC"]
    ],
    raw: true,
  });

  return sales;
};

// Productos más vendidos
const getTopSoldProducts = async () => {
  const products = await SellProduct.findAll({
    attributes: ["ProductId", [fn("SUM", col("quantity")), "totalSold"]],
    include: [{ model: Product, attributes: ["name"] }],
    group: ["ProductId", "Product.id"],
    order: [[fn("SUM", col("quantity")), "DESC"]],
    limit: 5,
  });
  return products;
};

// Ventas por usuario
const getSalesByUser = async () => {
  const sales = await SellProduct.findAll({
    include: [
      {
        model: Sell,
        where: { status: "finalizado" },
        attributes: [],
        include: [{ model: User, attributes: ["id", "name", "email"] }],
      },
      {
        model: Product,
        attributes: [],
      },
    ],
    attributes: [
      [col("Sell.userId"), "userId"],
      [fn("COUNT", col("Sell.id")), "salesCount"],
      [fn("SUM", col("Sell.totalAmount")), "totalSales"],
      [
        fn(
          "SUM",
          literal(
            `("Product"."price" - "Product"."buyPrice") * "SellProduct"."quantity"`
          )
        ),
        "profit",
      ],
    ],
    group: ["Sell.userId", "Sell->User.id", "Sell->User.name", "Sell->User.email"], // 👈 todos los campos no agregados
    order: [[fn("SUM", col("Sell.totalAmount")), "DESC"]],
    raw: true,
  });

  return sales;
};
const getAllCatalogs = async () => {
    const catalogs = await User.findAll({
        include: [
            {
                model: Product,
                where: {isActive:true},
                include: [Category]
            }
        ]
    });
    return catalogs;
}
const getProfitByDateRange = async (startDate, endDate) => {
  const profits = await SellProduct.findAll({
    include: [
      {
        model: Sell,
        where: {
          status: "finalizado",
          creationDate: { [Op.between]: [startDate, endDate] },
        },
        attributes: [],
      },
      {
        model: Product,
        attributes: [],
      },
    ],
    attributes: [
      [fn("COUNT", col("Sell.id")), "salesCount"],
      [fn("SUM", col("Sell.totalAmount")), "totalSales"],
      [
        fn(
          "SUM",
          literal(`("Product"."price" - "Product"."buyPrice") * "SellProduct"."quantity"`)
        ),
        "totalProfit",
      ],
    ],
    raw: true,
  });

  return profits[0] || { salesCount: 0, totalSales: 0, totalProfit: 0 };
};


module.exports = {getDashBoard, getAllCatalogs, getSalesByDay, getSalesByMonth, getSalesByUser, getTopSoldProducts,getProfitByDateRange};