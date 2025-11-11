
const {Router} = require("express");
const { productRouter } = require("./product_routes");
const { categoryRouter } = require("./category_routes");
const {dashboardRouter}   = require("./dashboard_routes");
const { userRouter } = require("./user_routes");
const {sellRouter} = require("./sell_routes");


const router = Router();

router.use("/products", productRouter);
router.use("/category", categoryRouter);
router.use("/dash",dashboardRouter );
router.use("/user", userRouter);
router.use("/sells", sellRouter)


module.exports = router;


