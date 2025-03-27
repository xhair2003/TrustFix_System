const mongoose = require("mongoose");

const SupplementaryPracticeCertificateSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    img2ndCertificate: {
      type: String,
      required: true,
    },
    service_industry: {
      type: String,
      ref: "ServiceIndustry",
      required: true,
    },
    createdAt: {
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

SupplementaryPracticeCertificateSchema.virtual("user", {
    ref: "User",
    localField: "user_id",
    foreignField: "_id",
    justOne: true,
  });

module.exports = mongoose.model(
  "SupplementaryPracticeCertificate",
  SupplementaryPracticeCertificateSchema
);