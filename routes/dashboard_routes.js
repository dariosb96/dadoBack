const{Router} = require('express');
const { 
    getSalesByDay_handler,
    getSalesByMonth_handler,
    getSalesByUser_handler,
    getTopSoldProducts_handler,
    getSalesByRange_handler,
    getAllUsers_handler,
    lowStockHandler,
    salesByWeekHandler,
    productProfitHandler,
    newUsersPerMonthHandler,
    inventoryValueHandler,

 } = require('../handlers/dashboard_handler');
const verifytoken = require('../middlewares/auth');

const DashboardRouter = Router();


DashboardRouter.get("/sales/day", verifytoken, getSalesByDay_handler);
DashboardRouter.get("/sales/month",verifytoken, getSalesByMonth_handler);
DashboardRouter.get("/top-products", verifytoken,getTopSoldProducts_handler);
DashboardRouter.get("/sales/user", verifytoken, getSalesByUser_handler)
DashboardRouter.get("/date-range", verifytoken, getSalesByRange_handler);
DashboardRouter.get("/users", verifytoken, getAllUsers_handler);
DashboardRouter.get("/lowStock", verifytoken, lowStockHandler);
DashboardRouter.get("/sales/week", verifytoken, salesByWeekHandler);
DashboardRouter.get("/product-profit", verifytoken, productProfitHandler)
DashboardRouter.get("/newUsers", verifytoken, newUsersPerMonthHandler)
DashboardRouter.get("/inv", verifytoken, inventoryValueHandler)
module.exports.dashboardRouter= DashboardRouter;