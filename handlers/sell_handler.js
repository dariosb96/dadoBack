const { createSell, confirmSell, getUserSells, getSellById } = require("../controllers/Sell_controller");

// Crear venta
const createSellHandler = async (req, res) => {
  try {
    const userId = req.userId; // viene del JWT
    const {  products } = req.body; // products = [{ productId, quantity }]
console.log("req.body:", req.body);
console.log("products:", req.body.products);

    const sell = await createSell(userId,  products);
    res.status(201).json(sell);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Confirmar venta
const confirmSellHandler = async (req, res) => {
  try {
    const userId = req.userId; // JWT
    const { sellId } = req.params;

    const sell = await confirmSell(sellId, userId);
    res.status(200).json(sell);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Ventas de un usuario
const getUserSellsHandler = async (req, res) => {
  try {
    const userId = req.userId; // JWT
    const sells = await getUserSells(userId);
    res.status(200).json(sells);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSellByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const sell = await getSellById(id);
    res.status(200).json(sell);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  createSellHandler,
  confirmSellHandler,
  getUserSellsHandler,
  getSellByIdHandler
};
