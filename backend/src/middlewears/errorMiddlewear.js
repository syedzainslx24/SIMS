const ApiError = require("../utils/ApiError");

const errorMiddlewear = (err, req, res, next) => {
 
  if (err instanceof ApiError) {
     console.error("Error caught by middlewear:", err.message);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  // for other errors apart from apiError//
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
module.exports = errorMiddlewear;
