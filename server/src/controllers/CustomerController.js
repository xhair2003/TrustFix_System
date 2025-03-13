const { User, Role, Wallet, Transaction, Complaint, Request, Rating, ServiceIndustry } = require("../models");
const cloudinary = require("../../config/cloudinary");
const fetch = require('node-fetch');

const getBalance = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy user ID từ token đã xác thực

        // Tìm wallet dựa trên user_id
        const wallet = await Wallet.findOne({ user_id: userId });

        if (!wallet) {
            return res.status(404).json({
                EC: 1,
                EM: "Không tìm thấy ví cho người dùng này!",
                balance: 0,
            });
        }

        return res.status(200).json({
            EC: 0,
            EM: "Lấy số dư thành công!",
            DT: wallet.balance, // Trả về số dư
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            EC: 1,
            EM: "Lỗi server, vui lòng thử lại sau!",
        });
    }
};

const getAllHistoryPayment = async (req, res) => {
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

        // Find all transactions for the user's wallet with transactionType as 'deposite'
        const transactions = await Transaction.find({ wallet_id: wallet._id, transactionType: 'payment' })
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

        // Find all transactions for the user's wallet with transactionType as 'deposite'
        const transactions = await Transaction.find({ wallet_id: wallet._id, transactionType: 'deposite' })
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
        const { request_id, complaintContent, complaintType, requestResolution } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!request_id || !complaintContent || !complaintType || !requestResolution) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập đầy đủ mã yêu cầu, nội dung, loại khiếu nại và yêu cầu giải quyết!"
            });
        }

        // Kiểm tra mã yêu cầu
        const request = await Request.findOne({ _id: request_id, user_id: userId });
        if (!request) {
            return res.status(400).json({
                EC: 0,
                EM: "Mã yêu cầu không hợp lệ hoặc không thuộc về người dùng này."
            });
        }

        // Upload ảnh mới nếu có
        let image = null; // Mặc định không có ảnh
        console.log(req.file); // Kiểm tra xem file có được upload không
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "complaint_images", // Upload vào thư mục complaint_images
                transformation: [{ width: 500, height: 500, crop: "limit" }]
            });
            image = result.secure_url; // Lấy link ảnh từ Cloudinary
        }

        // Tạo mới khiếu nại
        const newComplaint = new Complaint({
            request_id: request_id,
            complaintContent: complaintContent,
            complaintType: complaintType,
            requestResolution: requestResolution,
            image: image, // Lưu đường dẫn ảnh
        });

        console.log(image);

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



const getAllRequests = async (req, res) => {
    const userId = req.user.id;
    const user_email = req.user.email;
    console.log("Email: ", user_email);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                EC: 0,
                EM: "Người dùng không tồn tại trong hệ thống!"
            });
        }

        // Lấy tất cả các yêu cầu của người dùng
        const requests = await Request.find({ user_id: userId })
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
        const { rating_id, comment } = req.body;
        const user_email = req.user.email;
        if (!comment || comment.trim().length === 0) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập bình luận!"
            });
        }
        const rating = await Rating.findByIdAndUpdate(rating_id, { comment }, { new: true });
        console.log("Rating edited :", rating);
        console.log("Edit by :", user_email);

        res.status(200).json({
            EC: 1,
            EM: "Cập nhật đánh giá thành công!",
            DT: rating
        });
    } catch (error) {
        console.log("Error editing rating:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi cập nhật đánh giá. Vui lòng thử lại sau!"
        });
    }
}
const deleteRating = async (req, res) => {
    try {
        const { rating_id } = req.params;
        const user_email = req.user.email;
        const rating = await Rating.findByIdAndDelete(rating_id);
        console.log("Rating deleted :", rating);
        console.log("Deleted by : ", user_email);
        res.status(200).json({
            EC: 1,
            EM: "Xóa đánh giá thành công!",
        });
    } catch (error) {
        console.log("Error deleting rating:", error);
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
        console.log(req.file);
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

const findNearbyRepairmen = async (req, res) => {
    try {
        const { address, radius } = req.body;
        const gomapApiKey = "AlzaSyhy1S40EaAbIPht2S-okkBnsuuhmpr5VOo";

        if (!address || !radius) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng cung cấp địa chỉ và bán kính tìm kiếm!"
            });
        }

        const searchRadius = parseFloat(radius);
        if (isNaN(searchRadius) || searchRadius <= 0) {
            return res.status(400).json({
                EC: 0,
                EM: "Bán kính tìm kiếm không hợp lệ!"
            });
        }

        const repairmanRole = await Role.findOne({ type: 'repairman' });
        if (!repairmanRole) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy vai trò thợ sửa chữa!"
            });
        }
        const repairmenUsers = await User.find({ _id: { $in: await Role.find({ type: 'repairman' }).distinct('user_id') } });

        if (!repairmenUsers || repairmenUsers.length === 0) {
            return res.status(200).json({
                EC: 1,
                EM: "Không tìm thấy thợ sửa chữa nào!",
                DT: []
            });
        }

        const nearbyRepairmen = [];

        for (const repairman of repairmenUsers) {
            if (repairman.address) {
                const gomapApiUrl = `https://maps.gomaps.pro/maps/api/distancematrix/json?destinations=${encodeURIComponent(repairman.address)}&origins=${encodeURIComponent(address)}&key=${gomapApiKey}`;

                try {
                    const gomapResponse = await fetch(gomapApiUrl);
                    const gomapData = await gomapResponse.json();

                    if (gomapData.status === 'OK' && gomapData.rows[0].elements[0].status === 'OK') {
                        const distanceValue = gomapData.rows[0].elements[0].distance.value;

                        if (distanceValue <= searchRadius * 1000) {
                            nearbyRepairmen.push({
                                _id: repairman._id,
                                firstName: repairman.firstName,
                                lastName: repairman.lastName,
                                email: repairman.email,
                                phone: repairman.phone,
                                address: repairman.address,
                                distance: gomapData.rows[0].elements[0].distance.text,
                                duration: gomapData.rows[0].elements[0].duration.text
                            });
                        }
                    } else {
                        console.warn(`GoMap API error for repairman ${repairman._id}: ${gomapData.status} - ${gomapData.error_message || gomapData.rows[0].elements[0].status}`);
                    }
                } catch (error) {
                    console.error(`Error calling GoMap API for repairman ${repairman._id}:`, error);
                }
            }
        }

        res.status(200).json({
            EC: 1,
            EM: "Tìm kiếm thợ sửa chữa gần đây thành công!",
            DT: nearbyRepairmen
        });

    } catch (error) {
        console.error("Error finding nearby repairmen:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};


// Controller để lấy thông tin người dùng
const getUserInfo = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy ID người dùng từ req.user

        // Truy vấn dữ liệu người dùng từ bảng User
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                EC: 0,
                EM: "Người dùng không tồn tại!",
            });
        }

        // Truy vấn các vai trò của người dùng từ bảng Role
        const roles = await Role.find({ user_id: userId }); // Lấy các vai trò có user_id bằng userId

        // Lấy thuộc tính type từ vai trò đầu tiên (nếu có)
        const type = roles.length > 0 ? roles[0].type : null; // Nếu không có vai trò, trả về null

        // Truy vấn balance từ bảng Wallet
        const wallets = await Wallet.find({ user_id: userId }); // Lấy các vai trò có user_id bằng userId

        // Lấy thuộc tính type từ vai trò đầu tiên (nếu có)
        const balance = wallets.length > 0 ? wallets[0].balance : 0; // Nếu không có vai trò, trả về 0

        // Trả về thông tin người dùng
        res.status(200).json({
            EC: 1,
            EM: "Lấy thông tin người dùng thành công",
            DT: {
                ...user.toObject(), // Chuyển đổi user thành object
                type, // Thêm thông tin type
                balance // Thêm thông tin số dư
            },
        });
    } catch (error) {
        res.status(500).json({
            EC: 0,
            EM: "Có lỗi xảy ra khi lấy thông tin người dùng",
        });
    }
};

const viewRepairHistory = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the token

        // Fetch all requests for the user
        const requests = await Request.find({ user_id: userId }).populate({
            path: 'serviceIndustry_id', // Populate the serviceIndustry_id field
            select: 'type' // Select only the type field from ServiceIndustry
        });

        // Check if requests exist
        if (!requests || requests.length === 0) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy lịch sử sửa chữa cho người dùng này."
            });
        }

        // Map through requests to include service type
        const repairHistory = requests.map(request => ({
            ...request.toObject(), // Convert Mongoose document to plain object
            serviceType: request.serviceIndustry_id ? request.serviceIndustry_id.type : null // Add service type
        }));

        res.status(200).json({
            EC: 1,
            EM: "Lấy lịch sử sửa chữa thành công!",
            DT: repairHistory
        });
    } catch (error) {
        console.error("Error fetching repair history:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi lấy lịch sử sửa chữa. Vui lòng thử lại sau!"
        });
    }
};

module.exports = {
    getBalance,
    getAllHistoryPayment,
    getAllDepositeHistory,
    createComplaint,
    getAllRequests,
    getRatingById,
    addRating,
    editRating,
    deleteRating,
    updateInformation,
    getUserInfo,
    viewRepairHistory,
    findNearbyRepairmen,
}