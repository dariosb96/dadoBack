const{Router} = require('express');
const { 
    getSalesByDay_handler,
    getSalesByMonth_handler,
    getSalesByUser_handler,
    getTopSoldProducts_handler,
    getSalesByRange_handler,

 } = require('../handlers/dashboard_handler');
const { verify } = require('crypto');
const verifytoken = require('../middlewares/auth');

const DashboardRouter = Router();


DashboardRouter.get("/sales/day", verifytoken, getSalesByDay_handler);
DashboardRouter.get("/sales/month",verifytoken, getSalesByMonth_handler);
DashboardRouter.get("/top-products", verifytoken,getTopSoldProducts_handler);
DashboardRouter.get("/sales/user", verifytoken, getSalesByUser_handler)
DashboardRouter.get("/date-range", verifytoken, getSalesByRange_handler)

module.exports.dashboardRouter= DashboardRouter;