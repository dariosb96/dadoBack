const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser,  getUsers, updateUser, deleteUser } = require("../controllers/user_controller");
const { getAllCatalogs } = require("../controllers/dashaboard_controller");
const secret = process.env.JWT_SECRET;

const createUser_handler = async (req,res) => {
    try{
        console.log("REQ BODY", req.body);
        const {name, businessName, email, password} = req.body;
         if (!name || !businessName || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }
        const newUser = await createUser(name, businessName, email, password);
        res.status(201).json(newUser)
    }catch(error){
        res.status(400).json({error: error.message});
    }
}

const login_handler = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({ where: { email }});
        if(!user){
            throw new Error("User not found");
        }
        
        const issPasswordValid = await bcrypt.compare(password, user.password);
        if(!issPasswordValid){
            throw new Error("invalid password");
        }

        const token = jwt.sign(
          { id: user.id, role: user.role }, // 🔥 ahora incluye el rol
            secret,
          { expiresIn: "1d" }
            );
        console.log(token)
        res.status(200).json({
            token,
            userdata: {
                id:user.id,
                email: user.email,
                 role: user.role,
            },
        });
    }catch(error){
        if(error.message === "User not found"){
            res.status(404).json({message: error.message});
        }else if (error.message === "invalid password" ){
            res.status(401).json({message: error.message});
        }else {
            res.status(500).json({message: error.message});
        console.log(error);        }
    }
};
const getUsersHandler = async(req, res) => {
    try{
        const users = await getUsers();
        res.status(200).json(users)
    }catch(error){
        res.status(500).json({error: error.message})
    }
}

const updateUserHandler = async (req, res) => {
    try{
        const updatedUser = await updateUser(req.params.userId, req.body)
        res.status(200).json(updatedUser);
    }catch(error){
        res.status(500).json({error: error.message});
    };

}

const deleteUserHandler = async(req, res) => {
    try{
        const result = await deleteUser(req.params.id);
        res.status(200).json("usuario eliminado con exito")
    }catch(error){
        res.status(500).json({error: error.message});
    }
}



module.exports = {
    createUser_handler,
    login_handler,
    getUsersHandler,
    updateUserHandler,
    deleteUserHandler,
   

}