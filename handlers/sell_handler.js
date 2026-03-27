const {
  createSell,
  confirmSell,
  getUserSells,
  getSellById,
  cancelSell,
  deleteSell,
} = require("../controllers/Sell_controller");

const createSellHandler = async (req, res) => {
  try {
    const sell = await createSell(req.user.id, req.body.products);
    res.status(201).json(sell);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const confirmSellHandler = async (req, res) => {
  try {
    const sell = await confirmSell(req.params.sellId, req.user.id);
    res.json(sell);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const cancelSellHandler = async (req, res) => {
  try {
    const response = await cancelSell(req.params.id, req.user.id);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getUserSellsHandler = async (req, res) => {
  try {
    const sells = await getUserSells(req.user.id);
    res.json(sells);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getSellByIdHandler = async (req, res) => {
  try {
    const sell = await getSellById(req.params.id, req.user.id);
    res.json(sell);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const deleteSellHandler = async (req, res) => {
  try {
    const response = await deleteSell(req.params.id, req.user.id);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



module.exports = {
  createSellHandler,
  confirmSellHandler,
  cancelSellHandler,
  getUserSellsHandler,
  getSellByIdHandler,
  deleteSellHandler
};
