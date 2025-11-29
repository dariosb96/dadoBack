
const {
  getSalesByDay,
  getSalesByMonth,
  getTopSoldProducts,
  getSalesByUser,
  getDashboardDataByDateRange, getAllUsers, getLowStockProducts, getSalesByWeek, getProductProfit, getNewUsersPerMonth, getInventoryValue
} = require("../controllers/dashaboard_controller");

const getSalesByDay_handler = async (req, res) => {
  try {
  const userId = req.userId;
    const result = await getSalesByDay(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en getSalesByDay_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

const getSalesByMonth_handler = async (req, res) => {
  try {
   const userId = req.userId;
    const result = await getSalesByMonth(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en getSalesByMonth_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

const getTopSoldProducts_handler = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.userId;
    const data = await getTopSoldProducts(startDate, endDate, userId);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error en getTopProductsHandler:", error);
    res.status(500).json({ error: "Error al obtener productos más vendidos" });
  }
};

const getSalesByUser_handler = async (req, res) => {
  try {
   const userId = req.userId;
    const result = await getSalesByUser(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en getSalesByUser_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

const getSalesByRange_handler = async (req, res) => {
try {
    const { startDate, endDate } = req.query;
   const userId = req.userId;
    if (!startDate || !endDate) {
      return res.status(400).json({
        error:
          "Debes enviar startDate y endDate. Ejemplo: ?startDate=2025-11-01&endDate=2025-11-06",
      });
    }

    const data = await getDashboardDataByDateRange(startDate, endDate, userId);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error en getDashboardHandler:", error);
    res.status(500).json({ error: "Error al obtener datos del dashboard" });
  }
};

const getAllUsers_handler = async (req, res) => {
  try {

    if (req.userRole !== "superadmin") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const users = await getAllUsers();
    res.status(200).json(users);

  } catch (error) {
    console.error("Error en getAllUsers_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

const lowStockHandler = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const userId = req.userId;

    const products = await getLowStockProducts(threshold, userId);

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const salesByWeekHandler = async (req, res) => {
  try {
     const userId = req.userId;
    const sales = await getSalesByWeek(userId);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const productProfitHandler = async (req, res) => {
  try {
        const userId = req.userId;

    const startDate = req.query.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDate = req.query.endDate || new Date();

    const data = await getProductProfit(startDate, endDate, userId);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const newUsersPerMonthHandler = async (req, res) => {
  try {
    if (req.userRole !== "superadmin") {
      return res.status(403).json({ error: "No autorizado" });
    }

    const data = await getNewUsersPerMonth();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const inventoryValueHandler = async (req, res) => {
  try {
    const userId = req.userId;
    const data = await getInventoryValue(userId);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSalesByDay_handler,
  getSalesByMonth_handler,
  getTopSoldProducts_handler,
  getSalesByUser_handler,
  getSalesByRange_handler,
  getAllUsers_handler,
  lowStockHandler,
  salesByWeekHandler,
  productProfitHandler,
  newUsersPerMonthHandler,
  inventoryValueHandler
};
