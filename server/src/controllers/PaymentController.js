
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
  const userId = req.user.id; // Get user ID from the authenticated token
  const session = await mongoose.startSession();
  let transactionComitted = false;

  try {
    session.startTransaction();
    const { amount, transaction_type } = req.body;

    if (!amount || !transaction_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if transaction_type is "PayOS"
    if (transaction_type !== "PayOS") {
      return res.status(400).json({ message: "Phương thức không hợp lệ. Yêu cầu phải là 'PayOS'." });
    }

    const wallet = await Wallet.findOne({ user_id: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const YOUR_DOMAIN_SUCCESS = `http://localhost:3000/wallet`;
    const YOUR_DOMAIN_CANCEL = `http://localhost:3000/wallet/deposit-into-account`;
    // Generate a numeric orderCode for PayOS API (must be a positive integer <= 9007199254740991)
    const orderCode = Math.floor(Math.random() * 9007199254740991) + 1; // Ensure it's positive and within range
    // Generate payCode with "PayOS-" prefix for internal tracking
    const randomDigits = orderCode.toString().padStart(9, '0');
    const payCode = `PayOS-${randomDigits}`;
    const description = "Payment for a service";

    const body = {
      orderCode: orderCode, // Numeric value for PayOS API
      amount: amount,
      description: description,
      // returnUrl: `${YOUR_DOMAIN_SUCCESS}/success.html`,
      // cancelUrl: `${YOUR_DOMAIN_CANCEL}/cancel.html`
      returnUrl: `${YOUR_DOMAIN_SUCCESS}`,
      cancelUrl: `${YOUR_DOMAIN_CANCEL}`
    };

    const saveTransaction = new Transaction({
      wallet_id: wallet._id,
      payCode, // Store payCode with "PayOS-" prefix
      amount,
      status: 0,
      transactionType: 'payment',
      content: description,
      balanceAfterTransact: wallet.balance + amount
    });

    await saveTransaction.save();
    await session.commitTransaction();
    transactionComitted = true;

    const paymentLinkResponse = await payos.createPaymentLink(body);
    const paymentlink = paymentLinkResponse.checkoutUrl;
    console.log("Payment link:", paymentlink);
    return res.status(200).json({ paymentlink, payCode });

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
  console.log("callback called");
  
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  console.log("Status :", data.desc);
  console.log("Order code:", data.orderCode);

  try {
    //const transaction = await Transaction.findOne({ payCode: data.orderCode });

    // Find the transaction using the payCode with "PayOS-" prefix
    const payCode = `PayOS-${data.orderCode.toString().padStart(9, '0')}`;
    const transaction = await Transaction.findOne({ payCode: payCode });
    console.log("Transaction:", transaction.payCode);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (data.desc === "success") {
      transaction.status = 1;
      const wallet = await Wallet.findById(transaction.wallet_id);
      if (wallet) {
        wallet.balance += transaction.amount * 1000;
        await wallet.save();
        console.log("Wallet balance after transaction:", wallet.balance);
      }
    } else {
      transaction.status = 2;
    }
    await transaction.save();
    console.log("Transaction updated successfully");
    res.status(200).json({ message: "Cập nhật giao dịch thành công !" });
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    res.status(500).json({ message: error.message });
  }
};

/////////////////////////MOMO
const paymentMOMO = async (req, res) => {
  const userId = req.user.id; // Get user ID from the authenticated token
  const session = await mongoose.startSession();
  session.startTransaction();
  let transactionCommitted = false;

  try {
    const { amount, transaction_type } = req.body;

    if (!amount || !transaction_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if transaction_type is "MOMO"
    if (transaction_type !== "MOMO") {
      return res.status(400).json({ message: "Phương thức không hợp lệ. Yêu cầu phải là 'MOMO'." });
    }

    const wallet = await Wallet.findOne({ user_id: userId }).session(session);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const partnerCode = 'MOMO';
    const apiUrl = "https://test-payment.momo.vn/v2/gateway/api/create"; // Ensure the endpoint is correct
    const requestType = "payWithMethod";
    const requestId = wallet._id;
    const orderInfo = "Thanh toán với MoMo";
    const redirectUrl = "http://localhost:3000/wallet"; // Replace with your website URL
    const ipnUrl = "https://9920-2001-ee0-4c92-6240-f0a9-3076-5354-102.ngrok-free.app/api/callbackMOMO";
    const expireTime = Math.floor(Date.now() / 1000) + 5 * 60;

    // Generate payCode with "MOMO-" prefix followed by a random 9-digit number
    const randomDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const payCode = `MOMO-${randomDigits}`;
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
      wallet_id: wallet._id,
      payCode,
      amount,
      status: 0,
      transactionType: 'payment',
      content: orderInfo,
      balanceAfterTransact: wallet.balance + amount
    });

    await saveTransaction.save({ session });

    const response = await axios.post(apiUrl, body);
    console.log("Response:", response.data);

    await session.commitTransaction();
    transactionCommitted = true;

    return res.status(200).json({ message: "Link thanh toán được tạo thành công !", response: response.data });
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
    res.status(200).json({ message: "Cập nhật giao dịch thành công !" });
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