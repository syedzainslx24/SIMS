const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to user collection
      required: true,
    },
    componentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Component", // reference to components collection
      required: true,
    },
    requiredQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    dateRequested: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
