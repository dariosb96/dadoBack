const { Router } = require("express");
const { createSellHandler, confirmSellHandler, getUserSellsHandler, getSellByIdHandler, deleteSell_handler, cancelSellHandler } = require("../handlers/sell_handler");
const verifytoken = require("../middlewares/auth"); 

const SellRouter = Router();

SellRouter.post("/", verifytoken, createSellHandler);
SellRouter.put("/confirm/:sellId", verifytoken, confirmSellHandler);
SellRouter.get("/", verifytoken, getUserSellsHandler);
SellRouter.get("/:id", verifytoken, getSellByIdHandler);
SellRouter.put("/cancel/:id", verifytoken, cancelSellHandler);

module.exports = SellRouter;


module.exports.sellRouter = SellRouter;
