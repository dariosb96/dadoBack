
const {hash} = require("crypto");
const User = require("../models/User");
const Category = require("../models/Category")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = process.env.JWT_SECRET;

const createUser = async (name, businessName, email, password, imageUrl) => {
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
    image: imageUrl || null,
    role: userCount === 0 ? "superadmin" : "user",
  });

  return newUser;
};



const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Usuario no encontrado");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("contraseña incorrecta");

  const token = jwt.sign({ id: user.id, role: user.role }, secret, {
    expiresIn: "1d",
  });

  const { password: _, ...userdata } = user.toJSON();
  return { token, userdata };
};


const getUsers = async() => {
    const users = await User.findAll();
    return users;
}

const updateUser = async (id, data, file) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  let newImageUrl = user.image;
  let newPublicId = user.public_id;

  if (file) {
    
    if (user.public_id) {
      await cloudinary.uploader.destroy(user.public_id);
    }
    newImageUrl = file.path;
    newPublicId = file.filename;
  } else if (data.removeImage) {
        if (user.public_id) {
      await cloudinary.uploader.destroy(user.public_id);
    }
    newImageUrl = null;
    newPublicId = null;
  }

  let newPassword = user.password;
  if (data.password && data.password.trim() !== "") {
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(data.password, salt);
  }

  const updatedFields = {
    name: data.name || user.name,
    businessName: data.businessName || user.businessName,
    email: data.email || user.email,
    password: newPassword,
    image: newImageUrl,
    public_id: newPublicId,
  };

  await user.update(updatedFields);

const cleanUser = user.toJSON();
delete cleanUser.password;
return cleanUser; 

};

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