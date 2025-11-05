const express = require("express");
const verifyJWT = require("../middlewears/authMiddlewear");
const {
  addComponent,
  getAllComponent,
  findComponent,
  editComponents,
  deleteComponents
} = require("../controllers/componentsController");
const Router = express.Router();

Router.route("/addComponent").post(verifyJWT, addComponent);

Router.route("/editComponent").post(verifyJWT,editComponents);

Router.route("/deleteComponent").post(verifyJWT,deleteComponents);

Router.route("/searchAllComponent").get(verifyJWT,getAllComponent);

Router.route("/findComponent").post(verifyJWT,findComponent);
module.exports = Router;
