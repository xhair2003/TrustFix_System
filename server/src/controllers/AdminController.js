const { ServiceIndustry, Service, Complaint, User, Request, Transaction, Wallet, Vip } = require("../models");
const mongoose = require('mongoose'); // Import mongoose để dùng ObjectId
const nodemailer = require('nodemailer'); // Import nodemailer để gửi email


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});





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
        const serviceIndustries = await ServiceIndustry.find()

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
        const serviceIndustry = await ServiceIndustry.findById(serviceIndustryId)

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
        const services = await Service.find().populate( 'serviceIndustry_id'); // Populate serviceIndustry details

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
        const service = await Service.findById(serviceId).populate('serviceIndustry_id'); // Populate serviceIndustry details

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
        ).populate('serviceIndustry_id'); // Populate serviceIndustry details

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

        // Kiểm tra xem nội dung phản hồi có được cung cấp không
        if (!complaintContent) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập nội dung phản hồi!"
            });
        }

        // Tìm khiếu nại gốc từ cơ sở dữ liệu và kiểm tra tính hợp lệ
        const parentComplaint = await Complaint.findById(parentComplaintId).populate({
            path: 'request_id',
            populate: {
                path: 'user_id',
                select: 'email firstName lastName'
            }
        });

        // Nếu không tìm thấy khiếu nại gốc
        if (!parentComplaint) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy khiếu nại gốc để phản hồi!"
            });
        }

        // Kiểm tra xem thông tin người dùng có hợp lệ không
        if (!parentComplaint.request_id || !parentComplaint.request_id.user_id) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy thông tin người dùng liên quan đến khiếu nại!"
            });
        }

        // Tạo đối tượng phản hồi mới từ khiếu nại gốc
        const newReply = new Complaint({
            user_id: adminUserId,
            complaintContent: complaintContent,
            complaintType: parentComplaint.complaintType, // Lấy loại khiếu nại từ khiếu nại gốc
            request_id: parentComplaint.request_id._id,
            parentComplaint: parentComplaintId
        });

        console.log("newReply object:", newReply); // Log đối tượng phản hồi mới

        // Lưu phản hồi vào cơ sở dữ liệu
        await newReply.save();

        // Tạo nội dung email phản hồi
        const emailContent = `
            <h1>Phản hồi khiếu nại</h1>
            <p>Xin chào ${parentComplaint.request_id.user_id.firstName} ${parentComplaint.request_id.user_id.lastName},</p>
            <p>Chúng tôi đã nhận được khiếu nại của bạn và đây là phản hồi từ admin:</p>
            <p>${complaintContent}</p>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        `;
        const anhemail = 'ducanh8903@gmail.com'
        // Cấu hình email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Email người gửi
            to: parentComplaint.request_id.user_id.email, // Email người nhận
            subject: "Phản hồi khiếu nại", // Tiêu đề email
            html: emailContent // Nội dung email dạng HTML
        };
        console.log("Mail user :" , parentComplaint.request_id.user_id.email);
        
        // Gửi email phản hồi
        await transporter.sendMail(mailOptions);

        // Trả về phản hồi thành công
        res.status(201).json({
            EC: 1,
            EM: "Phản hồi khiếu nại thành công và email đã được gửi!",
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
};
const addVipService = async (req , res ) => {
    const { name, description, price } = req.body;
    try {
        if(!name || !description || !price) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập đầy đủ thông tin dịch vụ"
            });
        }
        const newVip = new Vip({
            name: name,
            description: description,
            price: price,
        });
        await newVip.save();
        res.status(201).json({
            EC: 1,
            EM: "Tạo dịch vụ VIP thành công!",
            DT: newVip
        });
    } catch (error) {
        console.log("Error creating VIP service:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
        
    }
}
const updateVipService = async (req, res) => {
    const { name, price, description, status } = req.body;
    try {
        // Tạo đối tượng cập nhật chỉ với các trường được truyền vào
        const updateFields = {};
        if (name) updateFields.name = name;
        if (price) updateFields.price = price;
        if (description) updateFields.description = description;
        if (status) updateFields.status = status;

        // Tìm và cập nhật dịch vụ VIP
        const updatedVip = await Vip.findOneAndUpdate(
            { name: name }, // Điều kiện tìm kiếm
            { $set: updateFields }, // Trường cần cập nhật
            { new: true } // Trả về tài liệu đã được cập nhật
        );

        if (!updatedVip) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy dịch vụ VIP để cập nhật!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Cập nhật dịch vụ VIP thành công!",
            DT: updatedVip
        });
    } catch (error) {
        console.error("Error updating VIP service:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi cập nhật dịch vụ VIP. Vui lòng thử lại sau!"
        });
    }
};
const deleteVipService = async (req, res) => {
    try {
        const vipId = req.params.id; // Lấy ID của dịch vụ VIP từ params

        // Tìm và xóa dịch vụ VIP
        const deletedVip = await Vip.findByIdAndDelete(vipId);

        if (!deletedVip) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy dịch vụ VIP để xóa!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Xóa dịch vụ VIP thành công!"
        });
    } catch (error) {
        console.error("Error deleting VIP service:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi xóa dịch vụ VIP. Vui lòng thử lại sau!"
        });
    }
};
const getAllVipServices = async (req, res) => {
    try {
        const vipServices = await Vip.find();

        res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách dịch vụ VIP thành công!",
            DT: vipServices
        });
    } catch (error) {
        console.error("Error getting all VIP services:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi lấy danh sách dịch vụ VIP. Vui lòng thử lại sau!"
        });
    }
};
const acceptUpdate = async (req, res) => {
    try {
        const update_id = req.body; 

        // Tìm yêu cầu nâng cấp
        const upgradeRequest = await RepairmanUpgradeRequest.findById(update_id).populate('user_id');

        if (!upgradeRequest) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy yêu cầu nâng cấp!"
            });
        }

        // Cập nhật trạng thái của yêu cầu nâng cấp thành "accepted"
        upgradeRequest.status = 'accepted';
        await upgradeRequest.save();

        // Thay đổi vai trò của người dùng thành "repairman"
        const user = await User.findById(upgradeRequest.user_id._id);
        user.role = 'repairman';
        await user.save();

        // Tạo nội dung email thông báo
        const emailContent = `
            <h1>Yêu cầu nâng cấp đã được chấp nhận</h1>
            <p>Xin chào ${user.firstName} ${user.lastName},</p>
            <p>Yêu cầu nâng cấp của bạn đã được chấp nhận. Vai trò của bạn đã được thay đổi thành "repairman".</p>
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
        `;

        // Cấu hình email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Email người gửi
            to: user.email, // Email người nhận
            subject: "Yêu cầu nâng cấp đã được chấp nhận", // Tiêu đề email
            html: emailContent // Nội dung email dạng HTML
        };

        // Gửi email thông báo
        await transporter.sendMail(mailOptions);

        // Trả về phản hồi thành công
        res.status(200).json({
            EC: 1,
            EM: "Yêu cầu nâng cấp đã được chấp nhận và email đã được gửi!",
            DT: upgradeRequest
        });

    } catch (error) {
        console.error("Error accepting upgrade request:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi chấp nhận yêu cầu nâng cấp. Vui lòng thử lại sau!"
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
    addVipService,
    updateVipService,
    deleteVipService,
    getAllVipServices,
    acceptUpdate
};
