const jwt = require("jsonwebtoken");
const secret= process.env.JWT_SECRET;

const verifytoken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.id;
        next(); // ✅ Llama a next para continuar con la ruta
    } catch (error) {
        return res.status(401).json({ message: "invalid token" });
    }
};

module.exports = verifytoken;