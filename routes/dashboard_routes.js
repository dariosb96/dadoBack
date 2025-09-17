const{Router} = require('express');
const { dashBoard_handler,
    getAllCatalogsHandler,
    getSalesByDay_handler,
    getSalesByMonth_handler,
    getSalesByUser_handler,
    getTopSoldProducts_handler,
    getProfitByDateRange_handler
 } = require('../handlers/dashboard_handler');

const DashboardRouter = Router();

DashboardRouter.get('/catalogs', getAllCatalogsHandler)
DashboardRouter.get('/', dashBoard_handler);
DashboardRouter.get("/sales/day", getSalesByDay_handler);
DashboardRouter.get("/sales/month", getSalesByMonth_handler);
DashboardRouter.get("/top-products", getTopSoldProducts_handler);
DashboardRouter.get("/sales/user", getSalesByUser_handler)
DashboardRouter.get("/profit-r", getProfitByDateRange_handler);
;
module.exports.dashboardRouter= DashboardRouter;