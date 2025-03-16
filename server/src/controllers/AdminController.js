const { ServiceIndustry, Service, Complaint, User, Request, Transaction, Wallet, Role, Rating, RepairmanUpgradeRequest, Vip } = require("../models");
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
                EM: "Vui lòng nhập tên chuyên mục cần tạo mới !"
            });
        }

        // Kiểm tra xem loại dịch vụ đã tồn tại chưa
        const existingServiceIndustry = await ServiceIndustry.findOne({ type });

        if (existingServiceIndustry) {
            return res.status(400).json({
                EC: 0,
                EM: 'Tên chuyên mục đã tồn tại trong hệ thống!',
            });
        }

        const newServiceIndustry = new ServiceIndustry({
            type: type,
        });

        await newServiceIndustry.save();

        res.status(201).json({
            EC: 1,
            EM: "Tạo chuyên mục thành công!",
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
            EM: "Lấy danh sách chuyên mục thành công!",
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

        // Kiểm tra xem loại dịch vụ đã tồn tại chưa (trừ trường hợp đang cập nhật chính nó)
        const existingServiceIndustry = await ServiceIndustry.findOne({ type });
        if (existingServiceIndustry && existingServiceIndustry._id.toString() !== serviceIndustryId) {
            return res.status(400).json({
                EC: 0,
                EM: 'Tên chuyên mục đã tồn tại trong hệ thống!',
            });
        }

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
                EM: "Không tìm thấy chuyên mục để cập nhật!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Cập nhật chuyên mục thành công!",
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
                EM: "Không tìm thấy chuyên mục để xóa!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Xóa chuyên mục thành công!"
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
                EM: "Vui lòng nhập tên danh mục cần tạo mới !"
            });
        }

        const newService = new Service({
            type: type,
            serviceIndustry_id: serviceIndustry_id
        });
        await newService.save();

        res.status(201).json({
            EC: 1,
            EM: "Tạo danh mục thành công !",
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
        const services = await Service.find().populate('serviceIndustry_id'); // Populate serviceIndustry details

        res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách danh mục thành công !",
            DT: services
        });
    } catch (err) {
        console.error('Get all services error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau !"
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

// const updateService = async (req, res) => {
//     try {
//         const serviceId = req.params.id;
//         const { type } = req.body;

//         // Kiểm tra xem loại dịch vụ đã tồn tại chưa (trừ trường hợp đang cập nhật chính nó)
//         const existingService = await Service.findOne({ type });
//         if (existingService && existingService._id.toString() !== serviceId) {
//             return res.status(400).json({
//                 EC: 0,
//                 EM: 'Danh mục đã tồn tại trong hệ thống !',
//             });
//         }

//         const updatedService = await Service.findByIdAndUpdate(
//             serviceId,
//             {
//                 type: type,
//             },
//             { new: true } // Return updated document
//         ).populate('serviceIndustry_id'); // Populate serviceIndustry details

//         if (!updatedService) {
//             return res.status(404).json({
//                 EC: 0,
//                 EM: "Không tìm thấy danh mục để cập nhật !"
//             });
//         }

//         res.status(200).json({
//             EC: 1,
//             EM: "Cập nhật danh muc thành công !",
//             DT: updatedService
//         });
//     } catch (err) {
//         console.error('Update service error:', err);
//         res.status(500).json({
//             EC: 0,
//             EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau !"
//         });
//     }
// };

const updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const { type, serviceIndustry_id } = req.body;  // Nhận thêm serviceIndustry_id từ body request

        // Kiểm tra xem loại dịch vụ đã tồn tại chưa (trừ trường hợp đang cập nhật chính nó)
        const existingService = await Service.findOne({ type });
        if (existingService && existingService._id.toString() !== serviceId) {
            return res.status(400).json({
                EC: 0,
                EM: 'Danh mục đã tồn tại trong hệ thống !',
            });
        }

        // Kiểm tra serviceIndustry_id có hợp lệ không (tồn tại trong cơ sở dữ liệu)
        const serviceIndustry = await ServiceIndustry.findById(serviceIndustry_id);  // Kiểm tra tồn tại loại chuyên mục
        if (!serviceIndustry) {
            return res.status(400).json({
                EC: 0,
                EM: 'Loại chuyên mục không hợp lệ!',
            });
        }

        // Cập nhật dịch vụ với thông tin mới, bao gồm cả serviceIndustry_id
        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            {
                type,
                serviceIndustry_id,  // Cập nhật serviceIndustry_id mới
            },
            { new: true } // Return updated document
        ).populate('serviceIndustry_id'); // Populate serviceIndustry details

        if (!updatedService) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy danh mục để cập nhật !"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Cập nhật danh mục thành công !",
            DT: updatedService
        });
    } catch (err) {
        console.error('Update service error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau !"
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
                EM: "Không tìm thấy danh mục để xóa !"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Xóa danh mục thành công !"
        });
    } catch (err) {
        console.error('Delete service error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau !"
        });
    }
};





// --- Complaint CRUD for Admin ---

const getAllComplaints = async (req, res) => {
    try {
        // Fetch only complaints that are 'pending'
        // const complaints = await Complaint.find({ status: 'pending' })
        const complaints = await Complaint.find()
            .populate({ // Populate thông tin người dùng thông qua Request
                path: 'request_id',
                populate: { path: 'user_id', select: 'firstName lastName email phone address' }
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
    try {
        const parentComplaintId = req.params.id; // ID của khiếu nại gốc
        const { complaintContent } = req.body; // Chỉ lấy complaintContent từ request body

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

        // Get the request details by the request_id from the complaint
        const request = await Request.findById(parentComplaint.request_id);
        if (!request) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy đơn hàng liên quan đến khiếu nại!"
            });
        }

        // Get the user who created the request
        const user = await User.findById(request.user_id);
        if (!user) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy người dùng đã tạo đơn hàng!"
            });
        }

        // Create the email content
        const emailContent = `
            <h1>Thông báo phản hồi khiếu nại</h1>
            <p>Xin chào ${user.firstName} ${user.lastName},</p>
            <p>Chúng tôi muốn thông báo rằng chúng tôi đã nhận được phản hồi từ quản trị viên về khiếu nại của bạn. Dưới đây là nội dung phản hồi của chúng tôi:</p>
            <p><strong>${complaintContent}</strong></p>
            <p>Xin vui lòng liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào.</p>
        `;

        // Set up the email transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS // Your email password or an app password
            }
        });

        // Setup email options
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender email
            to: user.email, // Recipient email
            subject: 'Thông báo phản hồi khiếu nại', // Email subject
            html: emailContent // HTML email content
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Update the complaint status to 'replied'
        parentComplaint.status = 'replied';
        await parentComplaint.save();

        res.status(200).json({
            EC: 1,
            EM: "Phản hồi khiếu nại thành công và đã gửi email đến người dùng!",
            DT: parentComplaint // You can send the complaint or the response data

            // // Kiểm tra xem thông tin người dùng có hợp lệ không
            // if (!parentComplaint.request_id || !parentComplaint.request_id.user_id) {
            //     return res.status(404).json({
            //         EC: 0,
            //         EM: "Không tìm thấy thông tin người dùng liên quan đến khiếu nại!"
            //     });
            // }

            // // Tạo đối tượng phản hồi mới từ khiếu nại gốc
            // const newReply = new Complaint({
            //     user_id: adminUserId,
            //     complaintContent: complaintContent,
            //     complaintType: parentComplaint.complaintType, // Lấy loại khiếu nại từ khiếu nại gốc
            //     request_id: parentComplaint.request_id._id,
            //     parentComplaint: parentComplaintId
            // });

            // console.log("newReply object:", newReply); // Log đối tượng phản hồi mới

            // // Lưu phản hồi vào cơ sở dữ liệu
            // await newReply.save();

            // // Tạo nội dung email phản hồi
            // const emailContent = `
            //     <h1>Phản hồi khiếu nại</h1>
            //     <p>Xin chào ${parentComplaint.request_id.user_id.firstName} ${parentComplaint.request_id.user_id.lastName},</p>
            //     <p>Chúng tôi đã nhận được khiếu nại của bạn và đây là phản hồi từ admin:</p>
            //     <p>${complaintContent}</p>
            //     <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            // `;
            // const anhemail = 'ducanh8903@gmail.com'
            // // Cấu hình email
            // const mailOptions = {
            //     from: process.env.EMAIL_USER, // Email người gửi
            //     to: parentComplaint.request_id.user_id.email, // Email người nhận
            //     subject: "Phản hồi khiếu nại", // Tiêu đề email
            //     html: emailContent // Nội dung email dạng HTML
            // };
            // console.log("Mail user :" , parentComplaint.request_id.user_id.email);

            // // Gửi email phản hồi
            // await transporter.sendMail(mailOptions);

            // // Trả về phản hồi thành công
            // res.status(201).json({
            //     EC: 1,
            //     EM: "Phản hồi khiếu nại thành công và email đã được gửi!",
            //     DT: newReply

        });

    } catch (error) {
        console.error("Error replying to complaint:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi phản hồi khiếu nại. Vui lòng thử lại sau!"
        });
    }
};

// const replyToComplaint = async (req, res) => {
//     console.log("req.body:", req.body); // Log req.body ngay đầu function
//     try {
//         const parentComplaintId = req.params.id; // ID của khiếu nại gốc
//         const { complaintContent } = req.body; // Chỉ lấy complaintContent từ request body
//         const adminUserId = req.user.id; // Lấy adminUserId trực tiếp từ req.user.id

//         if (!complaintContent) {
//             return res.status(400).json({
//                 EC: 0,
//                 EM: "Vui lòng nhập nội dung phản hồi!"
//             });
//         }

//         const parentComplaint = await Complaint.findById(parentComplaintId);
//         if (!parentComplaint) {
//             return res.status(404).json({
//                 EC: 0,
//                 EM: "Không tìm thấy khiếu nại gốc để phản hồi!"
//             });
//         }

//         const newReply = new Complaint({
//             user_id: adminUserId,
//             complaintContent: complaintContent,
//             complaintType: parentComplaint.complaintType,
//             request_id: parentComplaint.request_id,
//             parentComplaint: parentComplaintId
//         });

//         console.log("newReply object:", newReply); // <-- Thêm dòng log này

//         await newReply.save();

//         res.status(201).json({
//             EC: 1,
//             EM: "Phản hồi khiếu nại thành công!",
//             DT: newReply
//         });

//     } catch (error) {
//         console.error("Error replying to complaint:", error);
//         res.status(500).json({
//             EC: 0,
//             EM: "Đã có lỗi xảy ra khi phản hồi khiếu nại. Vui lòng thử lại sau!"
//         });
//     }
// };

// // View history payment with transactionType = payment





const viewHistoryPayment = async (req, res) => {
    try {
        const transactionType = "payment";

        const transactions = await Transaction.find({
            transactionType
        })
            .populate({
                path: "wallet_id", // Populate wallet_id field
                select: "user_id", // Only select the user_id field from wallet
                populate: {
                    path: "user_id", // Populate user_id from wallet
                    model: "User",   // Populate the User model
                    select: "firstName lastName email phone address", // Select specific fields from User model
                    populate: {
                        path: "roles", // Populate roles virtual field in User model
                        model: "Role", // Populate the Role model
                        select: "type"  // Only include the 'type' field from the Role model
                    }
                }
            })
            .populate('request')  // Populating the request virtual field
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

// const viewHistoryPayment = async (req, res) => {
//     try {
//         const { limit, search = "", transactionType = "payment" } = req.query;

//         const limitNumber = limit ? parseInt(limit) : undefined;

//         const searchFilter = search ? { payCode: { $regex: search, $options: "i" } } : {};
//         const transactionFilter = transactionType ? { transactionType } : {};

//         const transactions = await Transaction.find({
//             ...transactionFilter,
//             ...searchFilter,
//         })
//             .populate({
//                 path: "wallet_id",
//                 select: "balance",
//             })
//             .limit(limitNumber)
//             .sort({ createdAt: -1 });

//         res.status(200).json({
//             EC: 1,
//             EM: "Lấy lịch sử thanh toán thành công!",
//             DT: transactions,
//         });
//     } catch (err) {
//         console.error("Get payment history error:", err);
//         res.status(500).json({
//             EC: 0,
//             EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
//         });
//     }
// }

//View all history payment have limit, page, search

const viewAllTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;

        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        const searchFilter = search
            ? {
                $or: [
                    { payCode: { $regex: search, $options: "i" } },
                    { content: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        const transactions = await Transaction.find({ ...searchFilter })
            .populate({
                path: "wallet_id",
                select: "balance",
            })
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 });

        const totalRecords = await Transaction.countDocuments({ ...searchFilter });

        res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách giao dịch thành công!",
            DT: {
                transactions,
                pagination: {
                    currentPage: pageNumber,
                    totalPages: Math.ceil(totalRecords / limitNumber),
                    totalRecords,
                },
            },
        });
    } catch (err) {
        console.error("Lấy danh sách giao dịch thất bại!", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
        });
    }
}

// View history payment with transactionType = deposite
const viewDepositeHistory = async (req, res) => {
    try {
        const transactionType = "deposite";

        const transactions = await Transaction.find({
            transactionType
        })
            .populate({
                path: "wallet_id", // Populate wallet_id field
                select: "user_id", // Only select the user_id field from wallet
                populate: {
                    path: "user_id", // Populate user_id from wallet
                    model: "User",   // Populate the User model
                    select: "firstName lastName email phone address", // Select specific fields from User model
                    populate: {
                        path: "roles", // Populate roles virtual field in User model
                        model: "Role", // Populate the Role model
                        select: "type"  // Only include the 'type' field from the Role model
                    }
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            EC: 1,
            EM: "Lấy lịch sử nạp tiền thành công!",
            DT: transactions,
        });
    } catch (err) {
        console.error("Get deposit history error:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
        });
    }
};

// const viewDepositeHistory = async (req, res) => {
//     try {
//         const { limit, search = "", transactionType = "deposite" } = req.query;

//         const limitNumber = limit ? parseInt(limit) : undefined;

//         const searchFilter = search ? { payCode: { $regex: search, $options: "i" } } : {};
//         const transactionFilter = transactionType ? { transactionType } : {};

//         const transactions = await Transaction.find({
//             ...transactionFilter,
//             ...searchFilter,
//         })
//             .populate({
//                 path: "wallet_id",
//                 select: "balance",
//             })
//             .limit(limitNumber)
//             .sort({ createdAt: -1 });

//         res.status(200).json({
//             EC: 1,
//             EM: "Lấy lịch sử nạp tiền thành công!",
//             DT: transactions,
//         });
//     } catch (err) {
//         console.error("Get deposite history error:", err);
//         res.status(500).json({
//             EC: 0,
//             EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
//         });
//     }
// }

// const getAllUsers = async (req, res) => {
//     try {
//         let { search = "", page = 1, limit = 10, sortBy = "createdAt", orderBy = "desc" } = req.query;

//         page = parseInt(page);
//         limit = parseInt(limit);
//         orderBy = orderBy === "desc" ? -1 : 1;

//         const adminUserIds = await Role.find({ type: "admin" }).distinct("user_id");

//         let filter = {
//             _id: { $nin: adminUserIds },
//             $or: [
//                 { firstName: new RegExp(search, "i") },
//                 { lastName: new RegExp(search, "i") },
//                 { email: new RegExp(search, "i") },
//                 { phone: new RegExp(search, "i") }
//             ]
//         };

//         const users = await User.find(filter)
//             .sort({ [sortBy]: orderBy })
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .select('-pass')
//             .populate({
//                 path: "roles",
//                 select: "type"
//             })
//             .lean();

//         const totalCount = await User.countDocuments(filter);
//         const totalPages = Math.ceil(totalCount / limit);

//         return res.status(200).json({
//             EC: 1,
//             EM: "Lấy danh sách tài khoản thành công!",
//             data: {
//                 page,
//                 limit,
//                 totalPages,
//                 totalCount,
//                 users,
//             }
//         });
//     } catch (err) {
//         return res.status(500).json({
//             EC: 0,
//             EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
//         });
//     }
// };





const getAllUsers = async (req, res) => {
    try {
        // Tự động sắp xếp theo 'createdAt' giảm dần
        const sortBy = "createdAt";
        const orderBy = -1; // -1 là giảm dần, 1 là tăng dần

        // Lấy tất cả các user có vai trò không phải admin
        const adminUserIds = await Role.find({ type: "admin" }).distinct("user_id");

        // Filter tìm kiếm người dùng
        let filter = {
            _id: { $nin: adminUserIds }
        };

        // Lấy danh sách người dùng với điều kiện đã tạo sẵn
        const users = await User.find(filter)
            .sort({ [sortBy]: orderBy }) // Sắp xếp theo createdAt giảm dần
            .select('-pass') // Không trả về mật khẩu
            .populate({
                path: "roles",
                select: "type"
            })
            .lean();

        return res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách tài khoản thành công!",
            DT: users,
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
        const { reason } = req.body;  // Lý do xóa tài khoản từ req.body

        if (!userId) {
            return res.status(400).json({ EC: 0, EM: "Vui lòng cung cấp userId!" });
        }

        // Tìm người dùng theo userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ EC: 0, EM: "Không tìm thấy người dùng!" });
        }

        // Lấy email người dùng cần xóa
        const email = user.email;

        // Gửi email thông báo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thông báo xóa tài khoản',
            html: `
                <h1>Thông báo xóa tài khoản</h1>
                <p>Xin chào ${user.firstName} ${user.lastName},</p>
                <p>Chúng tôi muốn thông báo rằng tài khoản của bạn tại TrustFix đã bị xóa.</p>
                <p>Lý do xóa tài khoản: <strong>${reason}</strong></p>
                <p>Xin vui lòng liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào.</p>
            `
        };

        await transporter.sendMail(mailOptions);  // Gửi email

        // Tiến hành xóa người dùng
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            EC: 1,
            EM: "Xóa tài khoản thành công và email đã được gửi!"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const lockUserByUserId = async (req, res) => {
    try {
        const { reason } = req.body;
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ EC: 0, EM: "Người dùng không tồn tại !" });
        }

        if (user.status === "Banned") {
            return res.status(400).json({ EC: 0, EM: "Tài khoản người dùng đã bị khóa trước đó !" });
        }

        user.status = "Banned";
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Tài khoản TrustFix của bạn đã bị khóa",
            html: `
                <h1>Thông báo khóa tài khoản</h1>
                <p>Chào ${user.firstName} ${user.lastName},</p>
                <p>Tài khoản của bạn đã bị khóa vì lý do:</p>
                <blockquote><strong>${reason}</strong></blockquote>
                <p>Nếu bạn có thắc mắc, vui lòng liên hệ đội ngũ hỗ trợ qua email: 
                    <a href="mailto:admin@trustfix.com" style="color: #007bff; text-decoration: none;">
                        admin@trustfix.com
                    </a>
                </p>
                <p>Trân trọng,</p>
                <p>Đội ngũ TrustFix</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ EC: 1, EM: "Tài khoản người dùng đã bị khóa và email đã được gửi !" });
    } catch (error) {
        return res.status(500).json({ EC: 0, EM: "Lỗi hệ thống. Vui lòng thử lại !" });
    }
};

const unlockUserByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ EC: 0, EM: "Người dùng không tồn tại !" });
        }

        if (user.status !== "Banned") {
            return res.status(400).json({ EC: 0, EM: "Tài khoản người dùng chưa bị khóa hoặc đã được mở khóa !" });
        }

        user.status = "Inactive";
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Tài khoản TrustFix của bạn đã được mở khóa",
            html: `
                <h1>Thông báo mở khóa tài khoản</h1>
                <p>Chào ${user.firstName} ${user.lastName},</p>
                <p>Tài khoản của bạn đã được mở khóa. Bạn có thể đăng nhập và tiếp tục sử dụng dịch vụ của chúng tôi.</p>
                <p>Nếu bạn có thắc mắc, vui lòng liên hệ đội ngũ hỗ trợ qua email: 
                    <a href="mailto:admin@trustfix.com" style="color: #007bff; text-decoration: none;">
                        admin@trustfix.com
                    </a>
                </p>
                <p>Trân trọng,</p>
                <p>Đội ngũ TrustFix</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ EC: 1, EM: "Tài khoản người dùng đã được mở khóa và email đã được gửi !" });
    } catch (error) {
        return res.status(500).json({ EC: 0, EM: "Lỗi hệ thống. Vui lòng thử lại !" });
    }
};




//Service Price
//Service Price
const addServicePrice = async (req, res) => {
    try {
        const { serviceName, price, description } = req.body;

        const name = serviceName;

        const servicePrice = new Vip({
            name,
            price,
            description
        });

        await servicePrice.save();

        res.status(200).json({
            EC: 1,
            EM: "Thêm giá dịch vụ thành công!",
            DT: servicePrice
        });
    } catch (error) {
        console.error("Error adding service price:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi thêm giá dịch vụ. Vui lòng thử lại sau!"
        });
    }
};
const updateServicePrice = async (req, res) => {
    try {
        const { serviceName, price, description } = req.body;

        const name = serviceName;

        const updateFields = {};
        if (name) updateFields.name = name;
        if (price) updateFields.price = price;
        if (description) updateFields.description = description;

        // Tìm và cập nhật dịch vụ
        const servicePrice = await Vip.findOneAndUpdate(
            { name: name }, // Điều kiện tìm kiếm
            { $set: updateFields }, // Trường cần cập nhật
            { new: true } // Trả về tài liệu đã được cập nhật
        );

        if (!servicePrice) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy dịch vụ để cập nhật giá!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Cập nhật dịch vụ thành công!",
            DT: servicePrice
        });
    } catch (error) {
        console.error("Error updating service price:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi cập nhật giá dịch vụ. Vui lòng thử lại sau!"
        });
    }
};
const deleteServicePrice = async (req, res) => {
    try {
        const serviceId = req.params.serviceId;

        const servicePrice = await Vip.findByIdAndDelete(serviceId);
        if (!servicePrice) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy dịch vụ để xóa giá!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Xóa giá dịch vụ thành công!",

        });
    } catch (error) {
        console.error("Error deleting service price:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi xóa giá dịch vụ. Vui lòng thử lại sau!"
        });
    }
};

const getAllServicePrice = async (req, res) => {
    try {
        const servicePrice = await Vip.find()
        console.log("All service price : ", servicePrice);

        res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách bảng giá dịch vụ thành công",
            DT: servicePrice
        })
    } catch (error) {
        console.error("Error getting all service prices:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi lấy danh sách giá dịch vụ. Vui lòng thử lại sau!"
        });
    }
}

// const viewRepairBookingHistory = async (req, res) => {
//     try {
//         const { page = 1, limit = 10, search = "" } = req.query;

//         const pageNumber = parseInt(page);
//         const limitNumber = parseInt(limit);

//         const searchFilter = search
//             ? { description: { $regex: search, $options: "i" } }
//             : {};

//         const requests = await Request.find(searchFilter)
//             .populate({
//                 path: "serviceIndustry_id",
//                 select: "type",
//                 model: ServiceIndustry,
//             })
//             .populate({
//                 path: "user_id",
//                 select: "firstName lastName",
//                 model: User,
//             })
//             // .populate({
//             //     path: "ratings",
//             //     select: "rate comment",
//             //     model: Rating,
//             // })
//             .skip((pageNumber - 1) * limitNumber)
//             .limit(limitNumber)
//             .sort({ createdAt: -1 });

//         res.status(200).json({
//             EC: 1,
//             EM: "Lấy lịch sử đặt sửa chữa thành công!",
//             DT: requests,
//         });
//     } catch (err) {
//         console.error("Lỗi khi lấy lịch sử đặt sửa chữa:", err);
//         res.status(500).json({
//             EC: 0,
//             EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
//         });
//     }
// };

const viewRepairBookingHistory = async (req, res) => {
    try {
        // Remove page, limit, and search query parameters
        // Fetch all the records without pagination and search filtering

        const requests = await Request.find()
            .populate({
                path: "serviceIndustry_id",
                select: "type",
                model: ServiceIndustry,
            })
            .populate({
                path: "user_id",
                select: "firstName lastName",
                model: User,
            })
            // .populate({
            //     path: "ratings",
            //     select: "rate comment",
            //     model: Rating,
            // })
            .sort({ createdAt: -1 }); // Sort by creation date in descending order

        res.status(200).json({
            EC: 1,
            EM: "Lấy lịch sử đặt sửa chữa thành công!",
            DT: requests,
        });
    } catch (err) {
        console.error("Lỗi khi lấy lịch sử đặt sửa chữa:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
        });
    }
};




const getPendingUpgradeRequests = async (req, res) => {
    try {
        const pendingRequests = await RepairmanUpgradeRequest.find({ status: 'pending' })
            .populate('user_id', 'firstName lastName email phone address imgAvt') // Populate user details
            .populate('serviceIndustry_id', 'type'); // Populate service industry type

        res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách yêu cầu nâng cấp đang chờ duyệt thành công!",
            DT: pendingRequests
        });
    } catch (err) {
        console.error('Get pending upgrade requests error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const verifyRepairmanUpgradeRequest = async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const { action, rejectReason } = req.body;

        if (!requestId || !action) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng cung cấp ID yêu cầu và hành động (approve/reject)!",
            });
        }

        const upgradeRequest = await RepairmanUpgradeRequest.findById(requestId).populate('user');
        if (!upgradeRequest) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy yêu cầu nâng cấp!",
            });
        }

        const userEmail = upgradeRequest.user.email;

        // Set up Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,  // Your email here
                pass: process.env.EMAIL_PASS,  // Your email password or an app password here
            },
        });

        if (action === 'approve') {
            // Update request status to approved
            upgradeRequest.status = 'Inactive';
            upgradeRequest.approvedAt = Date.now();
            await upgradeRequest.save();

            // Update user role to repairman
            let userRole = await Role.findOne({ user_id: upgradeRequest.user_id });
            if (userRole) {
                userRole.type = 'repairman';
                await userRole.save();
            } else {
                // Create role if not exists (should not happen in normal flow)
                userRole = new Role({
                    user_id: upgradeRequest.user_id,
                    type: 'repairman',
                });
                await userRole.save();
            }

            // Send email to the user informing them of approval
            const mailOptionsApprove = {
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: 'Yêu cầu nâng cấp thợ sửa chữa của bạn đã được phê duyệt',
                html: `
                    <h1>Phê duyệt yêu cầu nâng cấp của bạn</h1>
                    <p>Chào ${upgradeRequest.user.firstName} ${upgradeRequest.user.lastName},</p>
                    <p>Chúng tôi xin chúc mừng bạn! Yêu cầu nâng cấp của bạn để trở thành thợ sửa chữa đã được phê duyệt.</p>
                    <p>Vai trò của bạn đã được cập nhật thành 'Thợ sửa chữa'. Bạn có thể bắt đầu nhận các yêu cầu sửa chữa từ khách hàng.</p>
                    <p>Cảm ơn bạn đã tham gia vào nền tảng của chúng tôi!</p>
                `,
            };

            await transporter.sendMail(mailOptionsApprove);

            res.status(200).json({
                EC: 1,
                EM: "Yêu cầu nâng cấp đã được phê duyệt thành công! Người dùng đã được chuyển thành thợ sửa chữa. Email thông báo đã được gửi đến người dùng.",
            });

        } else if (action === 'reject') {
            if (!rejectReason) {
                return res.status(400).json({
                    EC: 0,
                    EM: "Vui lòng cung cấp lý do từ chối khi từ chối yêu cầu!",
                });
            }
            // Delete the upgrade request (reject action)
            await RepairmanUpgradeRequest.findByIdAndDelete(requestId);

            // Send email to the user informing them of rejection
            const mailOptionsReject = {
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: 'Yêu cầu nâng cấp thợ sửa chữa của bạn đã bị từ chối',
                html: `
                    <h1>Từ chối yêu cầu nâng cấp của bạn</h1>
                    <p>Chào ${upgradeRequest.user.firstName} ${upgradeRequest.user.lastName},</p>
                    <p>Chúng tôi rất tiếc phải thông báo rằng yêu cầu nâng cấp của bạn để trở thành thợ sửa chữa đã bị từ chối.</p>
                    <p>Lý do từ chối: <strong>${rejectReason}</strong></p>
                    <p>Chúng tôi hy vọng bạn sẽ tiếp tục cải thiện và có thể đăng ký lại trong tương lai. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
                    <p>Cảm ơn bạn đã hiểu và tham gia!</p>
                `,
            };

            await transporter.sendMail(mailOptionsReject);

            res.status(200).json({
                EC: 1,
                EM: "Từ chối yêu cầu nâng cấp tài khoản thợ thành công. Email thông báo đã được gửi đến người dùng.",
            });
        } else {
            return res.status(400).json({
                EC: 0,
                EM: "Hành động không hợp lệ! Vui lòng chọn 'approve' hoặc 'reject'.",
            });
        }

    } catch (err) {
        console.error('Verify repairman upgrade request error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
        });
    }
};

module.exports = {
    getPendingUpgradeRequests,
    verifyRepairmanUpgradeRequest,
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
    addServicePrice,
    updateServicePrice,
    deleteServicePrice,
    getAllServicePrice,
    getAllUsers,
    deleteUserById,
    viewAllTransactions,
    viewDepositeHistory,
    lockUserByUserId,
    unlockUserByUserId,
    viewRepairBookingHistory,
};
