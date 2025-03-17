const { User, Role, RepairmanUpgradeRequest, ServiceIndustry, Service, Vip, DuePrice, Price, Rating } = require("../models");
const cloudinary = require("../../config/cloudinary");

// lấy type của ServiceIndustry
// API GET để lấy tất cả các loại dịch vụ (type)
const getTypeServiceIndustry = async (req, res) => {
    try {
        // Lấy tất cả các bản ghi từ bảng ServiceIndustry và chỉ lấy trường 'type'
        const serviceTypes = await ServiceIndustry.find({}, { type: 1 });

        // Nếu không có loại dịch vụ nào
        if (!serviceTypes || serviceTypes.length === 0) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy loại dịch vụ nào!"
            });
        }

        // Trả về danh sách các loại dịch vụ
        res.status(200).json({
            EC: 1,
            DT: serviceTypes,
            EM: "Lấy loại dịch vụ thành công"
        });
    } catch (err) {
        console.error("Error fetching service types:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
}

const requestRepairmanUpgrade = async (req, res) => {
    try {
        const userId = req.user.id; // User ID from verified token

        const { serviceType, address, description } = req.body;

        console.log("address", address);

        // Validate required fields
        if (!serviceType || !address || !description) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng điền đầy đủ thông tin yêu cầu nâng cấp!"
            });
        }

        // Check if user is customer
        const userRole = await Role.findOne({ user_id: userId });
        if (!userRole || userRole.type !== 'customer') {
            return res.status(403).json({
                EC: 0,
                EM: "Bạn không có quyền thực hiện nâng cấp này!"
            });
        }

        // Find service industry by type
        const serviceIndustry = await ServiceIndustry.findOne({ type: serviceType }); // Tìm ServiceIndustry bằng serviceType
        if (!serviceIndustry) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy loại hình dịch vụ!"
            });
        }

        let imgCertificatePracticeUrls = [];
        let imgCCCDUrls = [];

        console.log("req.files", req.files); // Kiểm tra xem req.files có chứa tệp hay không

        // Kiểm tra và upload imgCertificatePractice
        if (req.files && req.files.imgCertificatePractice) {
            for (const file of req.files.imgCertificatePractice) {
                const resultCertificatePractice = await cloudinary.uploader.upload(file.path, {
                    folder: "repairman_upgrade",
                    transformation: [{ width: 500, height: 500, crop: "limit" }]
                });
                imgCertificatePracticeUrls.push(resultCertificatePractice.secure_url);  // Lưu URL vào mảng
            }
        }

        // Kiểm tra và upload imgCCCD
        if (req.files && req.files.imgCCCD) {
            for (const file of req.files.imgCCCD) {
                const resultCCCD = await cloudinary.uploader.upload(file.path, {
                    folder: "repairman_upgrade",
                    transformation: [{ width: 500, height: 500, crop: "limit" }]
                });
                imgCCCDUrls.push(resultCCCD.secure_url);  // Lưu URL vào mảng
            }
        }

        // Update user's address
        await User.findByIdAndUpdate(userId, { address: address });

        // Create new Repairman Upgrade Request
        const newRequest = new RepairmanUpgradeRequest({
            user_id: userId,
            serviceIndustry_id: serviceIndustry._id, // Lấy _id của ServiceIndustry từ serviceType
            imgCertificatePractice: imgCertificatePracticeUrls,
            imgCCCD: imgCCCDUrls,
            description: description,
            status: 'Pending', // Default status: Pending
        });

        console.log("imgCertificatePracticeUrls", imgCertificatePracticeUrls);
        console.log("imgCCCDUrls", imgCCCDUrls);

        await newRequest.save();

        res.status(201).json({
            EC: 1,
            EM: "Yêu cầu nâng cấp lên thợ sửa chữa đã được gửi thành công! Vui lòng chờ Admin phê duyệt."
        });

    } catch (err) {
        console.error('Repairman upgrade request error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

// const getAllVips = async (req, res) => {
//     try {
//       let { page = 1, limit = 10, search } = req.query;
//       page = parseInt(page);
//       limit = parseInt(limit);

//       if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
//         return res.status(400).json({
//           EC: 1,
//           EM: "Giá trị page hoặc limit không hợp lệ!",
//           data: [],
//         });
//       }

//       let filter = {};
//       if (search) {
//         filter.$or = [
//           { description: { $regex: search, $options: "i" } },
//           { price: isNaN(search) ? null : parseFloat(search) },
//         ];
//       }

//       const vips = await Vip.find(filter)
//         .populate({
//           path: "user_id",
//           model: User,
//           select: "firstName lastName email phone",
//         })
//         .skip((page - 1) * limit)
//         .limit(limit)
//         .sort({ createdAt: -1 });

//       const totalVips = await Vip.countDocuments(filter);
//       const totalPages = Math.ceil(totalVips / limit);

//       return res.status(200).json({
//         EC: 0,
//         EM: "Lấy danh sách VIP thành công!",
//         data: {
//           currentPage: page,
//           totalPages,
//           totalRecords: totalVips,
//           vips,
//         },
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({
//         EC: 1,
//         EM: "Lỗi server, vui lòng thử lại sau!",
//         data: [],
//       });
//     }
//   };
const getAllVips = async (req, res) => {
    try {
        // Lấy tất cả các bản ghi mà không có điều kiện lọc
        const vips = await Vip.find({}).sort({ createdAt: -1 }); // Sắp xếp theo ngày tạo

        return res.status(200).json({
            EC: 0,
            EM: "Lấy danh sách VIP thành công!",
            DT: vips
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            EC: 1,
            EM: "Lỗi server, vui lòng thử lại sau!",
        });
    }
};




const getStatusRepairman = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the repairman request by the user ID
        const repairmanRequest = await RepairmanUpgradeRequest.findOne({ user_id: userId });

        // If the repairman request does not exist
        if (!repairmanRequest) {
            return res.status(404).json({ EC: 0, EM: "Không tìm thấy yêu cầu nâng cấp!" });
        }

        // Return the current status of the repairman request
        return res.status(200).json({
            EC: 1,
            EM: "Lấy trạng thái thợ thành công !",
            DT: repairmanRequest.status
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ EC: 0, EM: "Lỗi hệ thống, vui lòng thử lại!" });
    }
};


const toggleStatusRepairman = async (req, res) => {
    try {
        const userId = req.user.id;

        const repairmanRequest = await RepairmanUpgradeRequest.findOne({ user_id: userId });

        if (!repairmanRequest) {
            return res.status(404).json({ EC: 0, EM: "Không tìm thấy yêu cầu nâng cấp!" });
        }

        if (repairmanRequest.status === "Active") {
            repairmanRequest.status = "Inactive";
        } else if (repairmanRequest.status === "Inactive") {
            repairmanRequest.status = "Active";
        } else {
            return res.status(400).json({ EC: 0, EM: "Trạng thái không thể thay đổi!" });
        }

        await repairmanRequest.save();

        return res.status(200).json({
            EC: 1,
            EM: `Trạng thái đã cập nhật thành ${repairmanRequest.status}`,
            DT: repairmanRequest.status
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ EC: 0, EM: "Lỗi hệ thống, vui lòng thử lại!" });
    }
};
const dealPrice = async (req, res, next) => {
    try {
        const { request_id, deal_price } = req.body;
        const repairmanId = req.user.id; // Lấy user ID của thợ sửa chữa từ token

        if (!duePrice_id || !deal_price) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng cung cấp duePrice_id và giá deal!"
            });
        }

        if (isNaN(deal_price)) {
            return res.status(400).json({
                EC: 0,
                EM: "Giá deal phải là một số!"
            });
        }

        const duePrice = await DuePrice.findById(duePrice_id);
        if (!duePrice) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy DuePrice với ID này!"
            });
        }

        const minPrice = parseFloat(duePrice.minPrice);
        const maxPrice = parseFloat(duePrice.maxPrice);
        const parsedDealPrice = parseFloat(deal_price);


        if (parsedDealPrice < minPrice || parsedDealPrice > maxPrice) {
            return res.status(400).json({
                EC: 0,
                EM: `Giá deal phải nằm trong khoảng từ ${minPrice} đến ${maxPrice}!`
            });
        }

        const newPrice = new Price({
            duePrice_id: duePrice_id,
            repairman_id: repairmanId,
            priceToPay: deal_price
        });
        const savedPrice = await newPrice.save();

        // Lấy thông tin repairman
        const repairmanInfo = await User.findById(repairmanId).select('firstName lastName email phone imgAvt address description');
        if (!repairmanInfo) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy thông tin thợ sửa chữa!"
            });
        }

        // Lấy tất cả ratings của repairman
        const repairmanRatings = await Rating.find({ user_id: repairmanId })
            .populate('request_id', 'description status'); // Populate thông tin request nếu cần

        res.status(201).json({
            EC: 1,
            EM: "Deal giá thành công!",
            DT: {
                repairman: repairmanInfo,
                ratings: repairmanRatings,
                dealPrice: savedPrice
            }
        });
        next();

    } catch (error) {
        console.error("Error in dealPrice API:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
}
module.exports = {
    requestRepairmanUpgrade,
    getAllVips,
    getTypeServiceIndustry,
    toggleStatusRepairman,
    getStatusRepairman,
    dealPrice
};
