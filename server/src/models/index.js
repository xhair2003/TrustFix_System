const mongoose = require('mongoose');

// Import models
const User = require('./user');
const Role = require('./Role');
const Wallet = require('./Wallet');
const Transaction = require('./Transaction');
const Vip = require('./Vip');
const Service = require('./Service');
const ServiceIndustry = require('./ServiceIndustry');
const Request = require('./Request');
const RepairmanUpgradeRequest = require('./RepairmanUpgradeRequest');
const DuePrice = require('./DuePrice');
const Price = require('./Price');
const Rating = require('./Rating');
const Address = require('./Address');
const Image = require('./Image');
const VeriMail = require('./VeriMail');
const Complaint = require('./Complaint');
const SecondCertificate = require("./SupplementaryPracticeCertifcate")

// Collection of all models
const models = {
    User,
    Role,
    Wallet,
    Transaction,
    Vip,
    Service,
    ServiceIndustry,
    Request,
    RepairmanUpgradeRequest,
    DuePrice,
    Price,
    Rating,
    Address,
    Image,
    VeriMail,
    Complaint,
    SecondCertificate
};

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected Successfully');
        return conn;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = {
    ...models,
    connectDB,
    mongoose
}; 