const { Router } = require("express");
const verifytoken = require("../middlewares/auth");
const allowOrgRoles = require("../middlewares/allowedRoles");
const handlers = require("../handlers/sell_handler");

const SellRouter = Router();

SellRouter.post("/", verifytoken, allowOrgRoles("owner","admin","staff"), handlers.createSellHandler);

SellRouter.put("/confirm/:sellId", verifytoken, allowOrgRoles("owner","admin"), handlers.confirmSellHandler);

SellRouter.get("/", verifytoken, allowOrgRoles("owner","admin","staff"), handlers.getUserSellsHandler);

SellRouter.get("/:id", verifytoken, allowOrgRoles("owner","admin","staff"), handlers.getSellByIdHandler);

SellRouter.put("/cancel/:id", verifytoken, allowOrgRoles("owner","admin"), handlers.cancelSellHandler);

SellRouter.delete("/del/:id", verifytoken, allowOrgRoles("owner","admin"), handlers.deleteSellHandler);

module.exports.sellRouter = SellRouter;