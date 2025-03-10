const { User, Role, Wallet, Transaction, Complaint, Request } = require("../models");

const getAllDepositeHistory = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from verified token

        // Find the user's wallet
        const wallet = await Wallet.findOne({ user_id: userId });
        if (!wallet) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy ví của người dùng!"
            });
        }

        // Find all transactions for the user's wallet
        const transactions = await Transaction.find({ wallet_id: wallet._id })
            .populate({
                path: 'wallet_id',
                populate: { path: 'user_id', select: 'firstName lastName email' } // Populate user info in wallet
            })
            .sort({ createdAt: -1 }); // Sort by createdAt in descending order ( mới nhất trước)

        res.status(200).json({
            EC: 1,
            EM: "Lấy lịch sử giao dịch thành công!",
            DT: transactions
        });

    } catch (error) {
        console.error("Error getting user transaction history:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }

}

const createComplaint = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy user ID từ token
        const { request_id, complaintContent, complaintType, requestResolution, image } = req.body;

        if (!request_id || !complaintContent || !complaintType || !requestResolution) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập đầy đủ mã yêu cầu, nội dung, loại khiếu nại và yêu cầu giải quyết!"
            });
        }

        const request = await Request.findOne({ _id: request_id, user_id: userId });
        if (!request) {
            return res.status(400).json({
                EC: 0,
                EM: "Mã yêu cầu không hợp lệ hoặc không thuộc về người dùng này."
            });
        }

        const newComplaint = new Complaint({
            request_id: request_id,
            complaintContent: complaintContent,
            complaintType: complaintType,
            requestResolution: requestResolution,
            image: image,
        });

        await newComplaint.save();

        res.status(201).json({
            EC: 1,
            EM: "Gửi khiếu nại thành công! Chúng tôi sẽ sớm phản hồi lại bạn.",
            DT: newComplaint
        });

    } catch (error) {
        console.error("Error creating complaint:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi gửi khiếu nại. Vui lòng thử lại sau!"
        });
    }
};

module.exports = {
    getAllDepositeHistory,
    createComplaint,
}