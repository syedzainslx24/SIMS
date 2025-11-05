const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    purchaseOrderNo: {
      type: String,
      required: true,
      trim: true,
    },
    partNo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    grnNo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    vendor: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Component", componentSchema);
