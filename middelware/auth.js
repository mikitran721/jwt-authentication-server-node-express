const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  // neu ko co thi gui loi 401
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decoded);

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
};

module.exports = verifyToken;
