const { getDashBoard, getAllCatalogs, getSalesByDay, getSalesByMonth, getSalesByUser, getTopSoldProducts, getProfitByDateRange } = require("../controllers/dashaboard_controller");

const dashBoard_handler = async(req, res) => {
    try{
        const data = await getDashBoard();
        res.json(data);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};
const getAllCatalogsHandler = async (req, res) => {
    try{
        const catalogs = await getAllCatalogs();
        res.status(200).json(catalogs);
    }catch(error){
        res.status(500).json({error: error.message})
    }
}
const getSalesByDay_handler = async (req, res) => {
    try {
      const data = await getSalesByDay();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const getSalesByMonth_handler= async (req, res) => {
    try {
      const data = await getSalesByMonth();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  const getTopSoldProducts_handler = async (req, res) => {
    try {
      const data = await getTopSoldProducts();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const getSalesByUser_handler = async (req, res) => {
    try {
      const data = await getSalesByUser();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  const getProfitByDateRange_handler = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // ej: ?startDate=2025-01-01&endDate=2025-01-31

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Debe enviar startDate y endDate" });
    }

    const profit = await getProfitByDateRange(startDate, endDate);
    res.json(profit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
    dashBoard_handler,
    getAllCatalogsHandler,
    getSalesByDay_handler,
    getSalesByMonth_handler,
    getSalesByUser_handler,
    getTopSoldProducts_handler,
    getProfitByDateRange_handler

};