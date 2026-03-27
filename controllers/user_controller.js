const { hash } = require("crypto");
const User = require("../models/User");
const Category = require("../models/Category");
const Organization = require("../models/Organization")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = process.env.JWT_SECRET;
const sendEmail = require("../middlewares/mailer");

// --- Convertir fechas a horario de México ---
const convertToMexicoTime = (date) => {
  return new Date(
    date.toLocaleString("en-US", { timeZone: "America/Mexico_City" })
  );
};

const createUser = async ({ name,  email, phone, password, imageUrl }) => {
const existingUser = await User.findOne({ where: { email } });
if (existingUser) throw new Error("El correo ya está registrado");


const hashedPassword = await bcrypt.hash(password, 12);
const userCount = await User.count();


// 🔥 Crear organización nueva para ese negocio


const newUser = await User.create({
name,
email,
phone,
password: hashedPassword,
image: imageUrl || null,
role: userCount === 0 ? "superadmin" : "admin",

});

  // Notificar al admin
  const htmlAdmin = `
    <h2>Nuevo usuario registrado en Daddo</h2>
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
  `;
  await sendEmail(process.env.EMAIL_USER, "Nuevo usuario registrado", htmlAdmin);

  // Notificar al usuario
  const htmlUser = `
    <h2>¡Bienvenido a Daddo!</h2>
    <p>Hola ${name}, tu cuenta fue creada con éxito.</p>
  `;
  await sendEmail(email, "Bienvenido a Daddo 🎉", htmlUser);

  // Convertir fechas a México
  const cleanUser = newUser.toJSON();
  cleanUser.createdAt = convertToMexicoTime(cleanUser.createdAt);
  cleanUser.updatedAt = convertToMexicoTime(cleanUser.updatedAt);
  delete cleanUser.password;

  return cleanUser;
};

// ======================================================
//                  CUSTOM ERRORS
// ======================================================
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

// ======================================================
//                  LOGIN USER
// ======================================================
const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new NotFoundError("Usuario no encontrado");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedError("Contraseña incorrecta");

  const token = jwt.sign(
{ id: user.id, role: user.role, organizationId: user.organizationId },
secret,
{ expiresIn: "1d" }
);

  const { password: _, ...userdata } = user.toJSON();

  // Convertir fechas
  userdata.createdAt = convertToMexicoTime(userdata.createdAt);
  userdata.updatedAt = convertToMexicoTime(userdata.updatedAt);

  return { token, userdata };
};

// ======================================================
//                  GET USERS (solo superadmin)
// ======================================================
const getUsers = async () => {
  const users = await User.findAll();

  // Convertir fechas
  return users.map(u => {
    const json = u.toJSON();
    delete json.password;
    json.createdAt = convertToMexicoTime(json.createdAt);
    json.updatedAt = convertToMexicoTime(json.updatedAt);
    return json;
  });
};

// ======================================================
//                  GET USER BY ID
// ======================================================
const getUserById = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;

  const json = user.toJSON();
  delete json.password;

  json.createdAt = convertToMexicoTime(json.createdAt);
  json.updatedAt = convertToMexicoTime(json.updatedAt);

  return json;
};

// ======================================================
//                  UPDATE USER
// ======================================================
const updateUser = async (id, data, file) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  let newImageUrl = user.image;
  let newPublicId = user.public_id;

  // Manejo de imagen
  if (file) {
    if (user.public_id) {
      await cloudinary.uploader.destroy(user.public_id);
    }
    newImageUrl = file.path;
    newPublicId = file.filename;
  } else if (data.removeImage) {
    if (user.public_id) await cloudinary.uploader.destroy(user.public_id);
    newImageUrl = null;
    newPublicId = null;
  }

  // Si cambia contraseña
  let newPassword = user.password;
  if (data.password && data.password.trim() !== "") {
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(data.password, salt);
  }

  await user.update({
    name: data.name || user.name,
    businessName: data.businessName || user.businessName,
    email: data.email || user.email,
    phone: data.phone || user.phone,
    password: newPassword,
    image: newImageUrl,
    public_id: newPublicId,
  });

  const cleanUser = user.toJSON();
  delete cleanUser.password;

  cleanUser.createdAt = convertToMexicoTime(cleanUser.createdAt);
  cleanUser.updatedAt = convertToMexicoTime(cleanUser.updatedAt);

  return cleanUser;
};

// ======================================================
//                  DELETE USER
// ======================================================
const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");

  await user.destroy();
  return { message: "Usuario eliminado con éxito" };
};

// ======================================================
//          PASSWORD RECOVERY
// ======================================================
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("No existe un usuario con ese correo");

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
  if (!user) throw new Error("Usuario no encontrado");

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
  resetPassword,
};
