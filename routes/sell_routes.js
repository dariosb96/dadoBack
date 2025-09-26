const { Router } = require("express");
const { createSellHandler, confirmSellHandler, getUserSellsHandler, getSellByIdHandler, deleteSell_handler } = require("../handlers/sell_handler");
const verifytoken = require("../middlewares/auth"); 

const SellRouter = Router();

SellRouter.post("/", verifytoken, createSellHandler);
SellRouter.put("/confirm/:sellId", verifytoken, confirmSellHandler);
SellRouter.get("/", verifytoken, getUserSellsHandler);
SellRouter.get("/:id", verifytoken, getSellByIdHandler);
SellRouter.delete("/:id", verifytoken, deleteSell_handler);

module.exports = SellRouter;


module.exports.sellRouter = SellRouter;
