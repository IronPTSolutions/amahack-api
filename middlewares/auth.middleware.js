const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports.isAuthenticated = (req, res, next) => {
  // Get Authorization header
  const authHeader = req.header("Authorization");

  if (authHeader) {
    // Check protocol
    const [authProtocol, token] = authHeader.split(" ");

    if (authProtocol === "Bearer") {
      // Verify token - if not correct it will throw exception
      jwt.verify(
        token || "",
        process.env.JWT_SECRET || "changeme",
        (error, decoded) => {
          if (error) {
            next(error);
          }

          if (decoded) {
            req.currentUser = decoded.id;
            next(error);
          }
        }
      );
    } else {
      next(createError(401));
    }
  } else {
    next(createError(401));
  }
};
