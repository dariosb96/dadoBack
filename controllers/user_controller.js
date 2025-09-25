
const {hash} = require("crypto");
const User = require("../models/User");
const Category = require("../models/Category")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = process.env.JWT_SECRET;

const createUser = async (name, businessName, email, password) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("El correo ya está registrado");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const userCount = await User.count();
  const newUser = await User.create({
    name,
    businessName,
    email,
    password: hashedPassword,
    role: userCount === 0 ? "superadmin" : "user", 
  });

  return newUser;
};


const loginUser = async (email, password) => {
    const user = await User.findOne({where: {email}});
    if(!user ){
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        throw new Error("invalid password");
    }
    const token = jwt.sign({id: user.id, role: user.role}, secret, {expiresIn: "1d"} );
    return token;
}

const getUsers = async() => {
    const users = await User.findAll();
    return users;
}
const updateUser = async(userId, data) => {
    const user = await User.findByPk(userId);
    if(!user) throw new Error('Usuario no encontrado');


    return await user.update(data);
}

const deleteUser = async(id) => {
    const user = await User.findByPk(id);
     if(!user) throw new Error('Usuario no encontrado');

    await user.destroy();
    return {message: 'usuario eliminado con exito'};
}


module.exports = {
    createUser,
    loginUser,
    getUsers,
    updateUser,
    deleteUser
}