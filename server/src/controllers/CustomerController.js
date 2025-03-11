const { User, Role, Wallet, Transaction, Complaint, Request, Rating } = require("../models");
const cloudinary = require("../../config/cloudinary");


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

const getRequestsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;

        const requests = await Request.find({ user_id: userId })
            .populate('user', 'firstName lastName email phone')
            .populate('serviceIndustry', 'name description')
            .populate('ratings', 'rating comment')
            .populate('images', 'url')
            .populate('repairman', 'name');

        res.status(200).json({
            EC: 1,
            EM: "Lấy thông tin yêu cầu của người dùng thành công!",
            DT: requests
        });
    } catch (err) {
        console.error("Get requests by user ID error:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find()
            .populate('user', 'firstName lastName email phone')
            .populate('serviceIndustry', 'name description')
            .populate('ratings', 'rating comment')
            .populate('images', 'url')
            .populate('repairman', 'name');

        res.status(200).json({
            EC: 1,
            EM: "Lấy thông tin tất cả yêu cầu thành công!",
            DT: requests
        });
    } catch (err) {
        console.error("Get all requests error:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};
const getRatingById = async (req, res) => {
    try {
        const userId = req.params.userId;

        const ratings = await Rating.find({ user_id: userId })
            .populate({
                path: 'userRole',
                match: { name: 'repairman' }, // Chỉ lấy những người dùng có vai trò là repairman
                select: 'firstName lastName email'
            })
            .populate('request', 'description status');

        res.status(200).json({
            EC: 1,
            EM: "Lấy thông tin đánh giá của người dùng thành công!",
            DT: ratings
        });
    } catch (err) {
        console.error("Get ratings by user ID error:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const addRating = async (req, res) => { 
    try {
        const { request_id, rate, comment } = req.body;
        const user_id = req.user.id;
        const user_email = req.user.email;

        if (!rate || rate < 1 || rate > 5) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập đánh giá từ 1-5!"
            });
        }

        if (!comment || comment.trim().length === 0) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập bình luận!"
            });
        }

        // Kiểm tra xem người dùng đã đánh giá yêu cầu này chưa
        const existingRating = await Rating.findOne({ request_id, user_id });
        if (existingRating) {
            return res.status(400).json({
                EC: 0,
                EM: "Bạn đã đánh giá một lần rồi!"
            });
        }

        const newRating = new Rating({
            request_id,
            user_id,
            rate,
            comment
        });

        const savedRating = await newRating.save();

        console.log("Rating saved:", savedRating);
        console.log("Rating by:", user_email);

        res.status(201).json({
            EC: 1,
            EM: "Đánh giá thành công!",
            DT: savedRating
        });

    } catch (error) {
        console.error("Error adding rating:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi thêm đánh giá. Vui lòng thử lại sau!"
        });
    }
};

const editRating = async (req, res) => {
    try {
     const {rating_id, comment } = req.body;
     const user_email = req.user.email;
        if(!comment || comment.trim().length === 0){
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập bình luận!"
            });
        }
        const rating = await Rating.findByIdAndUpdate(rating_id, {comment}, {new: true});
        console.log("Rating edited :",rating);
        console.log("Edit by :" ,user_email);
        
        res.status(200).json({
            EC: 1,
            EM: "Cập nhật đánh giá thành công!",
            DT: rating
        });
    } catch (error) {
        console.log("Error editing rating:",error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi cập nhật đánh giá. Vui lòng thử lại sau!"
        });
    }
}
const deleteRating = async (req , res) => { 
    try {
        const {rating_id} = req.params;
        const user_email = req.user.email;
        const rating = await Rating.findByIdAndDelete(rating_id);
        console.log("Rating deleted :",rating);
        console.log("Deleted by : ",user_email);
        res.status(200).json({
            EC: 1,
            EM: "Xóa đánh giá thành công!",
        });
    } catch (error) {
        console.log("Error deleting rating:",error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại sau!"
        });
    }
}
const updateInformation = async (req, res) => {
    try {
        const { email, firstName, lastName, phone, address, description } = req.body;
        const userId = req.user.id;

        // Tìm user theo userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                EC: 0,
                EM: "Người dùng không tồn tại trong hệ thống!"
            });
        }

        // Upload ảnh mới nếu có
        let imgAvt = user.imgAvt; // Mặc định giữ ảnh cũ
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "user_avatars", // Upload vào thư mục user_avatars
                transformation: [{ width: 500, height: 500, crop: "limit" }]
            });
            imgAvt = result.secure_url; // Lấy link ảnh từ Cloudinary
        }

        // Cập nhật thông tin người dùng
        if (email) user.email = email;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (phone) user.phone = phone;
        user.imgAvt = imgAvt;
        if (address) user.address = address;
        if (description) user.description = description;

        // Lưu cập nhật
        await user.save();

        // Xóa password trước khi trả về response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            EC: 1,
            EM: "Cập nhật thông tin thành công!",
            DT: userResponse
        });

    } catch (err) {
        console.error("Update information error:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};
module.exports = {
    getAllDepositeHistory,
    createComplaint,
    getRequestsByUserId,
    getAllRequests,
    getRatingById,
    addRating,
    editRating,
    deleteRating,
    updateInformation
}