const userModel = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const generateRefreshAndAccessToken = async function (user_id) {
  try {
    const user = await userModel.findById(user_id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "error occured while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //get the registering user details from this request
  const { name, email, password, role } = req.body;
  //check if any of the received feilds is empty
  if ([name, email, password, role].some((value) => value?.trim() === "")) {
    throw new ApiError(400, "data feilds cannot be empty");
  }
  //check if user already user exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "user already exisits please login");
  }
  const isAdmin = role.toLowerCase() === "admin" ? true : false;
  const newUser = await userModel.create({
    name,
    email,
    password,
    isAdmin,
  });
  //once the new user created , double check if user has been created if not then throw an error
  const cretaedUser = await userModel
    .findOne(newUser._id)
    .select("-password -refreshToken");
  if (!cretaedUser) {
    throw new ApiError(404, "Sommething went wrong while creating user");
  }

  //get refresh and access tokens
  const { refreshToken, accessToken } = await generateRefreshAndAccessToken(
    cretaedUser._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  //start a session
  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        cretaedUser,
        "User created and logged in successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  //extract email and pw
  const { email, password } = req.body;
  if ([email, password].some((feild) => feild?.trim() === "")) {
    throw new ApiError(404, "email/password feild cannot be empty");
  }
  const existingUser = await userModel.findOne({ email });
  //check if user exist in db
  if (!existingUser) {
    throw new ApiError(
      404,
      "User with this email does not exist , please SignUp"
    );
  }
  //check if the given password matches with the user password
  if (!(await existingUser.isPasswordCorrect(password))) {
    console.log("checking for password");
    throw new ApiError(404, "provided password does not match");
  }
  const loggedInUser = existingUser.toObject();
  delete loggedInUser.password;
  delete loggedInUser.refreshToken;
  //get refresh and access tokens
  const { refreshToken, accessToken } = await generateRefreshAndAccessToken(
    loggedInUser._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  //start a session
  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await userModel.findByIdAndUpdate(
    req.user.user_id,
    { $set: { refreshToken: "" } },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully!"));
});

module.exports = { registerUser, loginUser ,logoutUser};
