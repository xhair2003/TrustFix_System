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
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: true,
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
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual for wallet
TransactionSchema.virtual("wallet", {
  ref: "Wallet",
  localField: "wallet_id",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("Transaction", TransactionSchema);
