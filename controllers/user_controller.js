
const {hash} = require("crypto");
const User = require("../models/User");
const Category = require("../models/Category")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = process.env.JWT_SECRET;
const sendEmail = require("../middlewares/mailer");

const createUser = async ({ name, businessName, email, phone, password, imageUrl }) => {
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
    phone,
    password: hashedPassword,
    image: imageUrl || null,
    role: userCount === 0 ? "superadmin" : "user",
  });

  return newUser;
};


//Errores:

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
  }
}
const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedError("Contraseña incorrecta");

  const token = jwt.sign({ id: user.id, role: user.role }, secret, {
    expiresIn: "1d",
  });

  const { password: _, ...userdata } = user.toJSON();
  return { token, userdata };
};


// const loginUser = async (email, password) => {
//   const user = await User.findOne({ where: { email } });
//   if (!user) throw new Error("Usuario no encontrado");

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) throw new Error("contraseña incorrecta");

//   const token = jwt.sign({ id: user.id, role: user.role }, secret, {
//     expiresIn: "1d",
//   });

//   const { password: _, ...userdata } = user.toJSON();
//   return { token, userdata };
// };

const getUsers = async() => {
    const users = await User.findAll();
    return users;
}

const getUserById = async (id) => {
   const user = await User.findByPk(id);
   return user;
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
    phone: data.phone || user.phone,
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

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error("No existe un usuario con ese correo");
  }

  // token válido 15 minutos
  const token = jwt.sign({ id: user.id }, secret, { expiresIn: "15m" });

  const resetLink = `${process.env.FRONT_URL}/reset-password/${token}`;

  await sendEmail(
    user.email,
    "Restablecimiento de contraseña - Daddo",
    `
      <h2>Restablece tu contraseña</h2>
      <p>Da clic en el siguiente enlace para cambiar tu contraseña:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>Este enlace expira en 15 minutos.</p>
    `
  );

  return { message: "Se envió un correo con el enlace de restablecimiento" };
};


const resetPassword = async (token, newPassword) => {
  let decoded;

  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }

  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;

  await user.save();

  return { message: "Contraseña actualizada correctamente" };
};


module.exports = {
    createUser,
    loginUser,
    getUsers,
    updateUser,
    deleteUser,
    getUserById,
    requestPasswordReset,
    resetPassword
}