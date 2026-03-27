// middlewares/checkPlan.js
const Subscription = require("../models/Subscription");

const checkPlan = (...allowedPlans) => {
  return async (req, res, next) => {
    try {
      const sub = await Subscription.findOne({
        where: { organizationId: req.user.organizationId }
      });

      if (!sub) return res.status(403).json({ error: "Sin suscripción" });

      if (!allowedPlans.includes(sub.plan)) {
        return res.status(403).json({
          error: "Tu plan no incluye esta función"
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ error: "Error verificando plan" });
    }
  };
};

module.exports = checkPlan;