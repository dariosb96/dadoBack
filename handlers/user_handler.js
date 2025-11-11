const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser,  getUsers, updateUser, deleteUser, loginUser, getUserById } = require("../controllers/user_controller");
const { getAllCatalogs } = require("../controllers/dashaboard_controller");
const secret = process.env.JWT_SECRET;


const createUser_handler = async (req, res) => {
  try {
    const { name, businessName, email, phone, password } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (!name || !businessName || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const newUser = await createUser({ name, businessName, email, phone, password, imageUrl });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserById_handler = async (req, res) => {
  
  try{
    const user = await getUserById(req.params.id);
    res.status(200).json(user)
  }catch(error){
    res.status(400).json({error: error.message})
  }
}

const login_handler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, userdata } = await loginUser(email, password);
    res.status(200).json({ token, userdata });
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "Invalid password") {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
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
  try {
    const { id } = req.params;
    const updatedUser = await updateUser(id, req.body, req.file);
    res.status(200).json({
      message: "Usuario actualizado con éxito",
      user: updatedUser, 
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message,
    });
  }
};


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
    getUserById_handler  

}