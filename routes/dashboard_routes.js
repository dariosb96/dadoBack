const{Router} = require('express');
const { dashBoard_handler, getAllCatalogsHandler } = require('../handlers/dashboard_handler');

const DashboardRouter = Router();

DashboardRouter.get('/catalogs', getAllCatalogsHandler)
DashboardRouter.get('/', dashBoard_handler);
module.exports.dashboardRouter= DashboardRouter;