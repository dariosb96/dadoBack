const {
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
} = require("../controllers/dashaboard_controller");

/**
 * 🔐 Scope desde JWT
 */
const getScope = (req) => ({
  organizationId: req.user.organizationId || null,
  userId: req.user.id || null, // fallback legacy
});

/* ================== VENTAS ================== */

const getSalesByDay_handler = async (req, res) => {
  try {
    res.json(await getSalesByDay(getScope(req)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getSalesByMonth_handler = async (req, res) => {
  try {
    res.json(await getSalesByMonth(getScope(req)));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const salesByWeekHandler = async (req, res) => {
  try {
    res.json(await getSalesByWeek(getScope(req)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalesByRange_handler = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate)
      return res.status(400).json({ error: "Debes enviar startDate y endDate" });

    res.json(await getDashboardDataByDateRange(startDate, endDate, getScope(req)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSalesByUser_handler = async (req, res) => {
  try {
    res.json(await getSalesByUser(getScope(req)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================== PRODUCTOS ================== */

const getTopSoldProducts_handler = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const data = await getTopSoldProducts(
      startDate,
      endDate,
      getScope(req)
    );

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const lowStockHandler = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    res.json(await getLowStockProducts(threshold, getScope(req)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const inventoryValueHandler = async (req, res) => {
  try {
    res.json(await getInventoryValue(getScope(req)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const productProfitHandler = async (req, res) => {
  try {
    const startDate = req.query.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDate = req.query.endDate || new Date();

    res.json(await getProductProfit(startDate, endDate, getScope(req)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================== ADMIN ================== */

const getAllUsers_handler = async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ error: "No autorizado" });

    res.json(await getAllUsers());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const newUsersPerMonthHandler = async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ error: "No autorizado" });

    res.json(await getNewUsersPerMonth());
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
  inventoryValueHandler,
};