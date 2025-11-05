//this is a controller for component related operations,
//required controllers are 1.add component 2.edit component 3.deletecomponent 4.search compoent"

const componentsModel = require("../models/componentsModel");
const { options } = require("../routes/componentsRouter");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const addComponent = asyncHandler(async (req, res) => {
  try {
    const componentData = req.body;
    if (!componentData) {
      throw new Error("component data not found");
    }
    const {
      name,
      description,
      partNo,
      grnNo,
      purchaseOrderNo,
      vendor,
      quantity,
      location,
      category,
    } = componentData;

    //check for mandatory feilds data
    if (
      [name, grnNo, purchaseOrderNo, quantity].some((feild) => feild === "")
    ) {
      throw new ApiError(404, "mandatory feilds cannot be empty");
    }
    const newComponent = await componentsModel.create({
      name,
      description,
      partNo,
      grnNo,
      purchaseOrderNo,
      vendor,
      quantity,
      location,
      category,
    });
    const isComponentCretaed = await componentsModel.findOne(newComponent._id);
    if (!isComponentCretaed) {
      throw new ApiError(404, "failed to create new component");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, newComponent, "Component created  successfully")
      );
  } catch (error) {
    console.log(error.message);
    res.status(404).json(new ApiResponse(404, (message = error.message)));
  }
});

const getAllComponent = asyncHandler(async (req, res) => {
  try {
    //Only first 20 components from the component schema will be fetched and sent
    const allComponents = await componentsModel
      .find({})
      .limit(20)
      .sort({ _id: -1 });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allComponents,
          "first 20 components from component schema are sent"
        )
      );
  } catch (error) {
    res.status(500).json(new ApiResponse(404, (message = error.message)));
  }
});

const editComponents = asyncHandler(async (req, res) => {
  try {
    const EditedData = req.body;
    console.log(EditedData);
    // receive component ID and edited feilds;
    if (!EditedData) {
      throw new ApiError(404, "Component Id and Edited data  cannot be empty");
    }
    const existingComponent = await componentsModel.findById(EditedData._id);
    if (!existingComponent) {
      throw new ApiError(
        404,
        "the component requested for edit is not found in DB"
      );
    }
    const updatedComponent = await componentsModel.findByIdAndUpdate(
      EditedData._id,
      EditedData,
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
         updatedComponent,
          "Component updated  successfully"
        )
      );
  } catch (error) {
    console.log(error.message);
    res.status(404).json(new ApiResponse(404, (message = error.message)));
  }
});

const deleteComponents = asyncHandler(async (req, res) => {
  try {
    const { componentID } = req.body;
    //receive component ID
    if (!componentID) {
      throw new ApiError(404, "Component Id and Edited data  cannot be empty");
    }
    const existingComponent = await componentsModel.findById(componentID);
    // console.log(existingComponent);
    if (!existingComponent) {
      throw new ApiError(
        404,
        "the component requested for delete is not found in DB"
      );
    }
    await componentsModel.findByIdAndDelete(componentID);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Component deleted  successfully"));
  } catch (error) {
    console.log(error.message);
    res.status(404).json(new ApiResponse(404, (message = error.message)));
  }
});
const findComponent = asyncHandler(async (req, res) => {
  try {
    const { searchKey } = req.body;
    // console.log(searchKey);
    const foundComponents = await componentsModel
      .find({
        $or: [
          { partNo: { $regex: searchKey, $options: "i" } },
          { grnNo: { $regex: searchKey, $options: "i" } },
        ],
      })
     
      // console.log("found comp",foundComponents)
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          foundComponents,
          "queried components sent"
        )
      );
  } catch (error) {
    res.status(500).json(new ApiResponse(404, (message = error.message)));
  }
});
module.exports = {
  addComponent,
  getAllComponent,
  editComponents,
  deleteComponents,
  findComponent
};
