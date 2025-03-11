const { ServiceIndustry, Service, Complaint, User, Request, Transaction, Wallet, Role, } = require("../models");
const mongoose = require('mongoose'); // Import mongoose để dùng ObjectId

// --- Service Industry CRUD ---

const createServiceIndustry = async (req, res) => {
    try {
        const { type } = req.body;

        if (!type) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập đầy đủ thông tin loại hình dịch vụ!"
            });
        }

        const newServiceIndustry = new ServiceIndustry({
            type: type,
        });

        await newServiceIndustry.save();

        res.status(201).json({
            EC: 1,
            EM: "Tạo loại hình dịch vụ thành công!",
            DT: newServiceIndustry
        });

    } catch (err) {
        console.error('Create service industry error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const getAllServiceIndustries = async (req, res) => {
    try {
        const serviceIndustries = await ServiceIndustry.find().populate( 'type'); // Populate service details

        res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách loại hình dịch vụ thành công!",
            DT: serviceIndustries
        });
    } catch (err) {
        console.error('Get all service industries error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const getServiceIndustryById = async (req, res) => {
    try {
        const serviceIndustryId = req.params.id;
        const serviceIndustry = await ServiceIndustry.findById(serviceIndustryId).populate( 'type'); // Populate service details

        if (!serviceIndustry) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy loại hình dịch vụ!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Lấy thông tin loại hình dịch vụ thành công!",
            DT: serviceIndustry
        });
    } catch (err) {
        console.error('Get service industry by ID error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const updateServiceIndustry = async (req, res) => {
    try {
        const serviceIndustryId = req.params.id;
        const { type } = req.body;

        const updatedServiceIndustry = await ServiceIndustry.findByIdAndUpdate(
            serviceIndustryId,
            {
                type: type,
            },
            { new: true } // Return updated document
        );

        if (!updatedServiceIndustry) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy loại hình dịch vụ để cập nhật!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Cập nhật loại hình dịch vụ thành công!",
            DT: updatedServiceIndustry
        });
    } catch (err) {
        console.error('Update service industry error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const deleteServiceIndustry = async (req, res) => {
    try {
        const serviceIndustryId = req.params.id;
        const deletedServiceIndustry = await ServiceIndustry.findByIdAndDelete(serviceIndustryId);

        if (!deletedServiceIndustry) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy loại hình dịch vụ để xóa!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Xóa loại hình dịch vụ thành công!"
        });
    } catch (err) {
        console.error('Delete service industry error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

// --- Service CRUD ---

const createService = async (req, res) => {
    try {
        const serviceIndustry_id = req.params.id;
        const { type } = req.body;

        if (!type) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập đầy đủ thông tin loại dịch vụ và loại hình dịch vụ!"
            });
        }

        const newService = new Service({
            type: type,
            serviceIndustry_id: serviceIndustry_id
        });
        await newService.save();

        res.status(201).json({
            EC: 1,
            EM: "Tạo dịch vụ thành công!",
            DT: newService
        });

    } catch (err) {
        console.error('Create service error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().populate( 'type'); // Populate serviceIndustry details

        res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách dịch vụ thành công!",
            DT: services
        });
    } catch (err) {
        console.error('Get all services error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const getServiceById = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await Service.findById(serviceId).populate('type'); // Populate serviceIndustry details

        if (!service) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy dịch vụ!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Lấy thông tin dịch vụ thành công!",
            DT: service
        });
    } catch (err) {
        console.error('Get service by ID error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const { type} = req.body;

        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            {
                type: type,

            },
            { new: true } // Return updated document
        ).populate('type'); // Populate serviceIndustry details

        if (!updatedService) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy dịch vụ để cập nhật!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Cập nhật dịch vụ thành công!",
            DT: updatedService
        });
    } catch (err) {
        console.error('Update service error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const deletedService = await Service.findByIdAndDelete(serviceId);

        if (!deletedService) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy dịch vụ để xóa!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Xóa dịch vụ thành công!"
        });
    } catch (err) {
        console.error('Delete service error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

// --- Complaint CRUD for Admin ---

const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate({ // Populate thông tin người dùng thông qua Request
                path: 'request_id',
                populate: { path: 'user_id', select: 'firstName lastName email' }
            })
            .populate('parentComplaint', 'complaintContent')
            .populate('replies');
        res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách khiếu nại thành công!",
            DT: complaints
        });
    } catch (error) {
        console.error("Error getting all complaints:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const getComplaintById = async (req, res) => {
    try {
        const complaintId = req.params.id;
        const complaint = await Complaint.findById(complaintId)
            .populate({  // Populate thông tin người dùng thông qua Request
                path: 'request_id',
                populate: { path: 'user_id', select: 'firstName lastName email' }
            })
            .populate('parentComplaint', 'complaintContent')
            .populate('replies');

        if (!complaint) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy khiếu nại!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Lấy thông tin khiếu nại thành công!",
            DT: complaint
        });
    } catch (error) {
        console.error("Error getting complaint by ID:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const replyToComplaint = async (req, res) => {
    console.log("req.body:", req.body); // Log req.body ngay đầu function
    try {
        const parentComplaintId = req.params.id; // ID của khiếu nại gốc
        const { complaintContent } = req.body; // Chỉ lấy complaintContent từ request body
        const adminUserId = req.user.id; // Lấy adminUserId trực tiếp từ req.user.id


        if (!complaintContent) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập nội dung phản hồi!"
            });
        }

        const parentComplaint = await Complaint.findById(parentComplaintId);
        if (!parentComplaint) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy khiếu nại gốc để phản hồi!"
            });
        }

        const newReply = new Complaint({
            user_id: adminUserId, // Sử dụng adminUserId trực tiếp từ req.user.id
            complaintContent: complaintContent, // Sử dụng complaintContent từ request body
            complaintType: parentComplaint.complaintType, // Giữ nguyên complaintType từ khiếu nại gốc
            //image: parentComplaint.image,
            parentComplaint: parentComplaintId // Tham chiếu đến khiếu nại gốc
        });

        await newReply.save();

        res.status(201).json({
            EC: 1,
            EM: "Phản hồi khiếu nại thành công!",
            DT: newReply
        });

    } catch (error) {
        console.error("Error replying to complaint:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi phản hồi khiếu nại. Vui lòng thử lại sau!"
        });
    }
};

// View history payment with transactionType = payment
const viewHistoryPayment = async (req, res) => {
    try {
        const { limit, search = "", transactionType } = req.query;

        const limitNumber = limit ? parseInt(limit) : undefined;

        const searchFilter = search ? { payCode: { $regex: search, $options: "i" } } : {};
        const transactionFilter = transactionType ? { transactionType } : {};

        const transactions = await Transaction.find({
            ...transactionFilter,
            ...searchFilter,
        })
            .populate({
                path: "wallet_id",
                select: "balance",
            })
            .limit(limitNumber)
            .sort({ createdAt: -1 });

        res.status(200).json({
            EC: 1,
            EM: "Lấy lịch sử thanh toán thành công!",
            DT: transactions,
        });
    } catch (err) {
        console.error("Get payment history error:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
        });
    }
}

const getAllUsers = async (req, res) => {
    try {
        let { search = "", page = 1, limit = 10, sortBy = "createdAt", orderBy = "desc" } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);
        orderBy = orderBy === "desc" ? -1 : 1;

        const adminUserIds = await Role.find({ type: "admin" }).distinct("user_id");

        let filter = {
            _id: { $nin: adminUserIds },
            $or: [
                { firstName: new RegExp(search, "i") },
                { lastName: new RegExp(search, "i") },
                { email: new RegExp(search, "i") },
                { phone: new RegExp(search, "i") }
            ]
        };

        const users = await User.find(filter)
            .sort({ [sortBy]: orderBy })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-password')
            .populate({
                path: "roles",
                select: "type"
            })
            .lean();

        const totalCount = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limit);

        return res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách tài khoản thành công!",
            data: {
                page,
                limit,
                totalPages,
                totalCount,
                users,
            }
        });
    } catch (err) {
        return res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ EC: 0, EM: "Vui lòng cung cấp userId!" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ EC: 0, EM: "Không tìm thấy người dùng!" });
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            EC: 1,
            EM: "Xóa tài khoản thành công!"
        });
    } catch (err) {
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

module.exports = {
    createServiceIndustry,
    getAllServiceIndustries,
    getServiceIndustryById,
    updateServiceIndustry,
    deleteServiceIndustry,
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    getAllComplaints,
    getComplaintById,
    replyToComplaint,
    viewHistoryPayment,
    getAllUsers,
    deleteUserById
};
