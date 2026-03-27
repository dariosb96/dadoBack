const {Router } = require('express');
const verifytoken = require('../middlewares/auth');
const allowOrgRoles = require('../middlewares/allowedRoles')
const {upload} = require("../middlewares/upload");
const handlers = require('../handlers/user_handler');

const UserRouter = Router();

UserRouter.post("/", upload.single("image"), handlers.createUser_handler);
UserRouter.post("/login", handlers.login_handler);

UserRouter.get("/", verifytoken,  handlers.getUsersHandler);
UserRouter.get("/:id", verifytoken,  handlers.getUserById_handler);
UserRouter.put("/:id", verifytoken, allowOrgRoles("owner","admin"), upload.single("image"), handlers.updateUserHandler);
UserRouter.delete('/:id', verifytoken, allowOrgRoles("owner"), handlers.deleteUserHandler);

UserRouter.post("/request-reset", handlers.requestPasswordResetHandler);
UserRouter.post("/reset/:token", handlers.resetPasswordHandler);

module.exports.userRouter = UserRouter;