
const { Wallet, Transaction } = require('../models');
const PayOS = require("@payos/node");
const mongoose = require('mongoose');
require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const { startSession } = require('../models/user');


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

const callbackPayOS = async (req, res) => {
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

/////////////////////////MOMO
const paymentMOMO = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let transactionCommitted = false;

  try {
    const { amount, wallet_id, transaction_type } = req.body;

    if (!amount || !wallet_id || !transaction_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const wallet = await Wallet.findById(wallet_id).session(session);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const partnerCode = 'MOMO';
    const apiUrl = "https://test-payment.momo.vn/v2/gateway/api/create"; // Ensure the endpoint is correct
    const requestType = "payWithMethod";
    const requestId = wallet_id;
    const orderInfo = "Thanh toán với MoMo";
    const redirectUrl = "https://www.facebook.com"; // Replace with your website URL
    const ipnUrl = "https://9920-2001-ee0-4c92-6240-f0a9-3076-5354-102.ngrok-free.app/api/callbackMOMO";
    const expireTime = Math.floor(Date.now() / 1000) + 5 * 60;

    const payCode = Math.floor(Math.random() * 1000000000);
    const orderId = payCode;
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const body = {
      partnerCode: partnerCode,
      partnerName: "Momo",
      storeID: "MOMO",
      requestId,
      amount: amount,
      orderId: payCode, // Corrected field name
      orderInfo: orderInfo,
      redirectUrl,
      ipnUrl,
      lang: "vi",
      requestType,
      extraData: "",
      signature: signature,
    };

    // console.log("Request Body:", body);

    const saveTransaction = new Transaction({
      wallet_id,
      payCode,
      amount,
      status: 0,
      transactionType: transaction_type,
      content: orderInfo,
      balanceAfterTransact: wallet.balance + amount
    });

    await saveTransaction.save({ session });

    const response = await axios.post(apiUrl, body);
    console.log("Response:", response.data);

    await session.commitTransaction();
    transactionCommitted = true;

    return res.status(200).json({ message: "Payment link created successfully", response: response.data });
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction();
    }
    console.log("Error:", error.message);
    if (error.response) {
      console.log("Error Response Data:", error.response.data);
      console.log("Error Response Status:", error.response.status);
      console.log("Error Response Headers:", error.response.headers);
    }
    return res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};


const callbackMOMO = async (req, res) => {
  console.log("Callback called");
  
  console.log("callback values:", req.body);
  const { partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature } = req.body;
 
  console.log("Status :", message);

  try {
    const transaction = await Transaction.findOne({ payCode: orderId });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (resultCode === 0) {
      transaction.status = 1; // Success
      const wallet = await Wallet.findById(transaction.wallet_id);
      if (wallet) {
        wallet.balance += transaction.amount;
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
  callbackPayOS,
  paymentMOMO,
  callbackMOMO
};