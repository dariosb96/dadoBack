
const {
  getSalesByDay,
  getSalesByMonth,
  getTopSoldProducts,
  getSalesByUser,
  getDashboardDataByDateRange
} = require("../controllers/dashaboard_controller");

const getSalesByDay_handler = async (req, res) => {
  try {
    const result = await getSalesByDay();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en getSalesByDay_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

const getSalesByMonth_handler = async (req, res) => {
  try {
    const result = await getSalesByMonth();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en getSalesByMonth_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

const getTopSoldProducts_handler = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await getTopSoldProducts(startDate, endDate);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error en getTopProductsHandler:", error);
    res.status(500).json({ error: "Error al obtener productos más vendidos" });
  }
};

const getSalesByUser_handler = async (req, res) => {
  try {
    const result = await getSalesByUser();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en getSalesByUser_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

const getSalesByRange_handler = async (req, res) => {
try {
    const { startDate, endDate, userId } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error:
          "Debes enviar startDate y endDate. Ejemplo: ?startDate=2025-11-01&endDate=2025-11-06",
      });
    }

    const data = await getDashboardDataByDateRange(startDate, endDate, userId);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error en getDashboardHandler:", error);
    res.status(500).json({ error: "Error al obtener datos del dashboard" });
  }
};

module.exports = {
  getSalesByDay_handler,
  getSalesByMonth_handler,
  getTopSoldProducts_handler,
  getSalesByUser_handler,
  getSalesByRange_handler
};
