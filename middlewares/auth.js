// const jwt = require("jsonwebtoken");
// const secret = process.env.JWT_SECRET;

// const verifytoken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Token missing or malformed" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, secret);
//     req.userId = decoded.id;
//     req.userRole = decoded.role; 
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "invalid token" });
//   }
// };

// module.exports = verifytoken;

const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "El token ha expirado" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido" });
    } else {
      return res.status(500).json({ message: "Error al validar el token" });
    }
  }
};

module.exports = verifyToken;
