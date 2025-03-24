const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    wallet_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    payCode: {
      type: String,
      //required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: true,
      default: 0,
      enum: [0, 1, 2], // 0: Pending, 1: Success, 2: Failed
    },
    transactionType: {
      type: String,
      enum: ["deposite", "payment"],
      required: true,
    },
    content: {
      type: String,
    },
    balanceAfterTransact: {
      type: Number,
      //required: true,
    },

    request_id: { // New field to link the transaction to a specific request
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: false,  // Only required for "payment" transactions
    },

  }, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for wallet
TransactionSchema.virtual("wallet", {
  ref: "Wallet",
  localField: "wallet_id",
  foreignField: "_id",
  justOne: true,
});

// Virtual for the related request (if present)
TransactionSchema.virtual("request", {
  ref: "Request",  // The model to populate (Request)
  localField: "request_id",  // The field in the Transaction schema
  foreignField: "_id",  // The field in the Request schema
  justOne: true,  // One transaction can have one request
});

module.exports = mongoose.model("Transaction", TransactionSchema);
