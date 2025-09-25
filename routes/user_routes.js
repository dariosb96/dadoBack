const {Router } = require('express');
const { createUser_handler, login_handler, getUsersHandler, deleteUserHandler, updateUserHandler } = require('../handlers/user_handler');

const verifytoken = require('../middlewares/auth');
const isSuperAdmin = require('../middlewares/superAdmin');

const UserRouter = Router();

UserRouter.post("/", createUser_handler);
UserRouter.post("/login", login_handler);
UserRouter.get("/", verifytoken,isSuperAdmin, getUsersHandler);
UserRouter.delete('/:id', verifytoken,isSuperAdmin, deleteUserHandler);
UserRouter.put("/:id",verifytoken,isSuperAdmin, updateUserHandler);

module.exports.userRouter = UserRouter;