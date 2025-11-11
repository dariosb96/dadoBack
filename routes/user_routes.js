const {Router } = require('express');
const { createUser_handler, login_handler, getUsersHandler, deleteUserHandler, updateUserHandler, getUserById_handler } = require('../handlers/user_handler');
const {upload} = require("../middlewares/upload")
const verifytoken = require('../middlewares/auth');
const isSuperAdmin = require('../middlewares/superAdmin');

const UserRouter = Router();

UserRouter.post("/", upload.single("image"), createUser_handler);
UserRouter.post("/login", login_handler);
UserRouter.get("/", verifytoken,isSuperAdmin, getUsersHandler);
UserRouter.get("/:id", getUserById_handler)
UserRouter.delete('/:id', verifytoken,isSuperAdmin, deleteUserHandler);
UserRouter.put("/:id",verifytoken,upload.single("image"), updateUserHandler);

module.exports.userRouter = UserRouter;