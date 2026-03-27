const {Router} = require('express');
const verifytoken = require('../middlewares/auth');
const allowOrgRoles = require('../middlewares/allowedRoles')
const handlers = require('../handlers/dashboard_handler');

const DashboardRouter = Router();

DashboardRouter.get("/sales/day", verifytoken, allowOrgRoles("owner","admin","staff"), handlers.getSalesByDay_handler);
DashboardRouter.get("/sales/month", verifytoken, allowOrgRoles("owner","admin","staff"), handlers.getSalesByMonth_handler);
DashboardRouter.get("/top-products", verifytoken, allowOrgRoles("owner","admin","staff"), handlers.getTopSoldProducts_handler);
DashboardRouter.get("/sales/user", verifytoken, allowOrgRoles("owner","admin"), handlers.getSalesByUser_handler);
DashboardRouter.get("/date-range", verifytoken, allowOrgRoles("owner","admin"), handlers.getSalesByRange_handler);
DashboardRouter.get("/users", verifytoken, allowOrgRoles("owner"), handlers.getAllUsers_handler);
DashboardRouter.get("/lowStock", verifytoken, allowOrgRoles("owner","admin"), handlers.lowStockHandler);
DashboardRouter.get("/sales/week", verifytoken, allowOrgRoles("owner","admin","staff"), handlers.salesByWeekHandler);
DashboardRouter.get("/product-profit", verifytoken, allowOrgRoles("owner","admin"), handlers.productProfitHandler);
DashboardRouter.get("/newUsers", verifytoken, allowOrgRoles("owner"), handlers.newUsersPerMonthHandler);
DashboardRouter.get("/inv", verifytoken, allowOrgRoles("owner","admin"), handlers.inventoryValueHandler);

module.exports.dashboardRouter = DashboardRouter;