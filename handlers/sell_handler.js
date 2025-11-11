const { createSell, confirmSell, getUserSells, getSellById, deleteSell } = require("../controllers/Sell_controller");


const createSellHandler = async (req, res) => {
  try {
    const userId = req.userId;
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Debes enviar al menos un producto" });
    }

    const sell = await createSell(userId, products);
    return res.status(201).json(sell);

  } catch (error) {
    console.error("Error en createSellHandler:", error.message);
    if (error.message.includes("Stock insuficiente") || error.message.includes("no encontrado")) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const confirmSellHandler = async (req, res) => {
  try {
    const userId = req.userId;
    const { sellId } = req.params;

    const sell = await confirmSell(sellId, userId);
    res.status(200).json(sell);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getUserSellsHandler = async (req, res) => {
  try {
    const userId = req.userId; 
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

const deleteSell_handler = async (req,res) => {
  try{
    const result = await deleteSell(req.params.id);
    res.json(result);
  }catch(error){
    res.status(400).json({error: error.message});
  }
}

module.exports = {
  createSellHandler,
  confirmSellHandler,
  getUserSellsHandler,
  getSellByIdHandler,
  deleteSell_handler
};
