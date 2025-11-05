const userModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

//async Handler will be used for every async function
const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    //extract the token from the incoming request
    //token may exist either in the cookies or in the authorization header
  
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Access, Token does not exist!");
    }
     const decodedData = jwt.verify(token,process.env.ACCESS_TOKEN_STRING);
    //extract the user from the userModel based on the ID present in the token
    const user = await userModel
      .findById(decodedData._id)
      .select("-password -refreshToken");
    //if user does not exist throw an error 
    if (!user) {
      throw new ApiError(404, "Invalid Access token,user not found!");
    }
    //in the request body objest set the user as the current user and call the next function .
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(404, "Invalid Access Token Error");
  }
});

module.exports = verifyJWT;
