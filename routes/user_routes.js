const {Router } = require('express');
const { createUser_handler, login_handler, getUsersHandler, deleteUserHandler } = require('../handlers/user_handler');
const { updateProduct } = require('../controllers/product_controller');

const UserRouter = Router();

UserRouter.post("/", createUser_handler);
UserRouter.post("/login", login_handler);
UserRouter.get("/", getUsersHandler);
UserRouter.delete('/:id', deleteUserHandler);
UserRouter.put("/:id", updateProduct);

module.exports.userRouter = UserRouter;