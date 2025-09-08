const { Router } = require("express");
const { createSellHandler, confirmSellHandler, getUserSellsHandler, getSellByIdHandler } = require("../handlers/sell_handler");
const verifytoken = require("../middlewares/auth"); 

const SellRouter = Router();

SellRouter.post("/", verifytoken, createSellHandler);
SellRouter.put("/confirm/:sellId", verifytoken, confirmSellHandler);
SellRouter.get("/", verifytoken, getUserSellsHandler);
SellRouter.get("/:id", verifytoken, getSellByIdHandler);

module.exports = SellRouter;


module.exports.sellRouter = SellRouter;
