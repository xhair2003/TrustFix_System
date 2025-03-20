const { Wallet, Transaction } = require('../models');
const PayOS = require("@payos/node");
const mongoose = require('mongoose');
require('dotenv').config();


const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

const payment = async (req, res) => {
  const session = await mongoose.startSession();
  let transactionComitted = false;

  try {
    session.startTransaction();
    const { amount, wallet_id, transaction_type } = req.body;

    if (!amount || !wallet_id || !transaction_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const wallet = await Wallet.findById(wallet_id);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const YOUR_DOMAIN = `http://localhost:8080`;
    const payCode = Math.floor(Math.random() * 1000000000);
    const description = "Payment for a service";

    const body = {
      orderCode: payCode,
      amount: amount,
      description: description,
      returnUrl: `${YOUR_DOMAIN}/success.html`,
      cancelUrl: `${YOUR_DOMAIN}/cancel.html`
    };

    const saveTransaction = new Transaction({
      wallet_id,
      payCode,
      amount,
      status: 0,
      transactionType: transaction_type,
      content: description,
      balanceAfterTransact: wallet.balance + amount
    });

    await saveTransaction.save();
    await session.commitTransaction();
    transactionComitted = true;

    const paymentLinkResponse = await payos.createPaymentLink(body);
    const paymentlink = paymentLinkResponse.checkoutUrl;
    console.log("Payment link:", paymentlink);
    return res.status(200).json({ paymentlink , payCode});

  } catch (error) {
    if (!transactionComitted) {
      await session.abortTransaction();
    }
    console.error("Transaction Failed:", error.message);
    return res.status(500).json({ message: error.message });

  } finally {
    session.endSession();
  }
};

const callback = async (req, res) => {
  console.log("callback values:", req.body);
  const {data} = req.body;
  if (!data) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  console.log("Status :", data.desc);
  console.log("Order code:", data.orderCode);
  
  try {
    const transaction = await Transaction.findOne({ payCode: data.orderCode });
  console.log("Transaction:", transaction.payCode);
  
    if (!transaction) { 
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (data.desc === "success") {
      transaction.status = 1;
      const wallet = await Wallet.findById(transaction.wallet_id);
      if(wallet) {
        wallet.balance += transaction.amount*1000;
        await wallet.save();
        console.log("Wallet balance after transaction:", wallet.balance); 
      }
    } else {
      transaction.status = 2;
    }
    await transaction.save();
    console.log("Transaction updated successfully");
    res.status(200).json({ message: "Transaction updated successfully" });
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  payment,
  callback
};