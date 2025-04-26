
const { Wallet, Transaction } = require('../models');
const PayOS = require("@payos/node");
const mongoose = require('mongoose');
require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const {encryptDisbursementData} = require('../utils/encryptPublickey');


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
    const ipnUrl ="https://ffb8-2001-ee0-4c9d-3e90-41ee-f8cd-9fa1-b5c5.ngrok-free.app/api/callbackMOMO";
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


// Hàm thực hiện disbursement
const withdrawMomo = async (req, res) => {
  const userId = req.user.id;
  console.log("User ID:", userId); // Log User ID
  const session = await mongoose.startSession();
  session.startTransaction();
  let transactionCommitted = false;

  try {
    const { amount, walletMoMoId } = req.body;
    console.log("Request Body:", req.body); // Log request body

    // Kiểm tra các tham số đầu vào
    if (!amount || !walletMoMoId) {
      console.log("Validation Error: Missing required fields"); // Log validation error
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (amount < 1000 || amount > 200000000) {
      console.log("Validation Error: Invalid amount range"); // Log validation error
      return res.status(400).json({ message: "Amount must be between 1,000 VND and 200,000,000 VND" });
    }

    // Lấy ví của người dùng
    const wallet = await Wallet.findOne({ user_id: userId }).session(session);
    console.log("Wallet:", wallet); // Log wallet details
    if (!wallet) {
      console.log("Error: Wallet not found"); // Log wallet not found
      return res.status(404).json({ message: "Wallet not found" });
    }
    if (wallet.balance < amount) {
      console.log("Error: Insufficient balance"); // Log insufficient balance
      return res.status(400).json({ message: "Số dư không đủ để thực hiện giao dịch" });
    }

    // Thông tin cần thiết để gửi yêu cầu đến MoMo
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const partnerCode = 'MOMO';
    const apiUrl = "https://test-payment.momo.vn/v2/gateway/api/disbursement/pay";
    const orderInfo = "Rút tiền về ví MoMo";
    const ipnUrl = "https://example.com/api/callbackMOMO"; // Thay bằng URL callback thực tế
    const requestType = "disburseToWallet";
    const lang = "vi";
    const extraData = "";

    // Tạo orderId và requestId
    const randomDigits = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const orderId = `MOMO${randomDigits}`;
    const requestId = `${wallet._id.toString().slice(0, 20)}-${Date.now().toString().slice(-8)}`;
    console.log("Generated Order ID:", orderId); // Log generated order ID
    console.log("Generated Request ID:", requestId); // Log generated request ID

    // Mã hóa disbursementMethod với walletMoMoId từ request
    const encryptedData = encryptDisbursementData(partnerCode, walletMoMoId, amount, orderId);
    console.log("Encrypted Data (disbursementMethod):", encryptedData); // Log encrypted data

    // Tạo chữ ký (signature)
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&disbursementMethod=${encryptedData}&extraData=${extraData}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
    console.log("Raw Signature:", rawSignature); // Log raw signature
    console.log("Generated Signature:", signature); // Log generated signature

    // Tạo body gửi đến MoMo
    const body = {
      partnerCode: partnerCode,
      orderId: orderId,
      amount: amount,
      requestId: requestId,
      requestType: requestType,
      disbursementMethod: encryptedData,
      ipnUrl: ipnUrl,
      extraData: extraData,
      orderInfo: orderInfo,
      lang: lang,
      signature: signature,
    };

    console.log("Request Body Sent to MoMo:", JSON.stringify(body, null, 2)); // Log request body sent to MoMo

    // Gửi yêu cầu đến MoMo API
    const response = await axios.post(apiUrl, body, { timeout: 30000 });
    console.log("Response from MoMo:", response.data); // Log response from MoMo

    // Lưu giao dịch vào cơ sở dữ liệu
    const saveTransaction = new Transaction({
      wallet_id: wallet._id,
      payCode: orderId,
      amount: amount,
      status: 0, // Trạng thái giao dịch ban đầu là chưa xử lý
      transactionType: 'withdraw',
      content: orderInfo,
      balanceAfterTransact: wallet.balance - amount,
    });
    await saveTransaction.save({ session });
    console.log("Transaction Saved:", saveTransaction); // Log saved transaction

    // Cam kết giao dịch
    await session.commitTransaction();
    transactionCommitted = true;
    console.log("Transaction Committed"); // Log transaction committed

    return res.status(200).json({ message: "Yêu cầu rút tiền đã được gửi thành công!", response: response.data });
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction();
      console.log("Transaction Aborted"); // Log transaction aborted
    }
    console.log("Error:", error.message); // Log error message
    if (error.response) {
      console.log("Error Response Data:", error.response.data); // Log error response data
      console.log("Error Response Status:", error.response.status); // Log error response status
      console.log("Error Response Headers:", error.response.headers); // Log error response headers
    }
    return res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
    console.log("Session Ended"); // Log session ended
  }
};

module.exports = {
  payment,
  callbackPayOS,
  paymentMOMO,
  callbackMOMO,
  withdrawMomo
};