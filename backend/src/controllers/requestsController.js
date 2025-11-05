const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const requestModel = require("../models/requestsModel");
const componentsModel = require("../models/componentsModel");
const userModel = require("../models/userModel");

const addRequest = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const employeeId = req.user.id;

    const { componentId, requiredQuantity } = req.body;
    console.log(
      "employeeid",
      employeeId,
      "componentId:",
      componentId,
      "requested:",
      requiredQuantity
    );
    if (!(componentId && requiredQuantity && employeeId)) {
      throw new Error("request data not found");
    }

    //check for user id
    if (!(await userModel.findById(employeeId))) {
      throw new ApiError(
        400,
        "Employee details of employee requesting for Component could not be found"
      );
    }
    //check for component
    if (!(await componentsModel.findById(componentId))) {
      throw new ApiError(400, "Component details could not be found");
    }
    //create new component
    const newRequest = await requestModel.create({
      employeeId,
      componentId,
      requiredQuantity,
    });
    //double check is request is created
    const newCreatedRequest = await requestModel
      .findById(newRequest._id)
      .populate("componentId", "name partNo")
      .lean();
    if (!newCreatedRequest) {
      throw new ApiError(404, "failed to create new request");
    }
    newCreatedRequest.dateRequested = new Date(
      newCreatedRequest.dateRequested
    ).toLocaleDateString("en-IN");
    res
      .status(200)
      .json(
        new ApiResponse(200, newCreatedRequest, "Request created  successfully")
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(400, error.message);
  }
});

const getAllRequests = asyncHandler(async (req, res) => {
  try {
    //if user is admin then send all requests
    //is user is employee then send only the requests which are requested specifically by him

    const isAdmin = req.user.isAdmin === true; 

    const allRequests = isAdmin
      ? await requestModel
          .find({})
          .populate("employeeId", "name email")
          .populate("componentId", "name partNo")
          .sort({ _id: -1 })
          .lean()
      : await requestModel
          .find({ employeeId: req.user._id })
          .populate("componentId", "name partNo")
          .sort({ _id: -1 })
          .lean();

    const formattedRequests = allRequests.map((req) => ({
      ...req,
      dateRequested: new Date(req.dateRequested).toLocaleDateString("en-IN"),
    }));
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          formattedRequests,
          "Requests from request schema are sent"
        )
      );
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiResponse(404, (message = error.message)));
  }
});

const handleRequests = asyncHandler(async (req, res) => {
  try {
    const { requestId, action } = req.body;
    if ([requestId, action].some((feild) => feild === "")) {
      throw new ApiError(404, "request ID and action is missing");
    }

     // await componentsModel.findByIdAndUpdate()
    const updatedRequest = await requestModel.findByIdAndUpdate(
      requestId,
      { status: action },
      { new: true, runValidators: true }
    );

    if (updatedRequest.status !== action) {
      res
        .status(401)
        .json(new ApiResponse(200, "failure", "failed updating status "));
      throw new ApiError(404, "failed updating status");
    }
    if (action === "approved") {
      const component = await componentsModel.findByIdAndUpdate(
        updatedRequest.componentId,
        { $inc: { quantity: -updatedRequest.requiredQuantity } },
        { new: true }
      );
    }

    res
      .status(200)
      .json(new ApiResponse(200, "success", "updated status successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiResponse(404, (message = error.message)));
  }
});
module.exports = { addRequest, getAllRequests, handleRequests };
