const { ServiceIndustry, Service, Complaint, User, Request, Transaction, Wallet, Role, Rating, RepairmanUpgradeRequest, Vip, ForumPost, ForumComment, Guide } = require("../models");
const mongoose = require('mongoose'); // Import mongoose để dùng ObjectId
const nodemailer = require('nodemailer'); // Import nodemailer để gửi email
const upload = require('../middlewares/upload')
const cron = require('node-cron'); // Import cron để lên lịch gửi email hàng tháng
const sendEmail = async (to, subject, htmlContent) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Định nghĩa mailOptions
    const mailOptions = {
        from: process.env.EMAIL_USER, // Người gửi
        to: to,                       // Người nhận
        subject: subject,            // Chủ đề email
        html: htmlContent            // Nội dung HTML
    };

    await transporter.sendMail(mailOptions);
};

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
            // .populate({ // Populate thông tin người dùng thông qua Request
            //     path: 'request_id',
            //     model: Request,
            //     populate: { path: 'user_id', select: 'firstName lastName email phone address' }
            // })
            .populate({
                path: 'request_id',
                model: Request,
                populate: [
                    { path: 'user_id', model: 'User', select: 'firstName lastName email phone address' },
                    {
                        path: 'repairman_id',
                        model: 'RepairmanUpgradeRequest',
                        populate: {
                            path: 'user_id',
                            model: 'User',
                            select: 'firstName lastName email phone address'
                        }
                    }
                ]
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
        const complaint = await Complaint.find({ _id: complaintId, status: { $in: ["pending", "replied"] } })
            .populate({  // Populate thông tin người dùng thông qua Request
                path: 'request_id',
                populate: { path: 'user_id', select: 'firstName lastName email' }
            })
            .populate('parentComplaint')


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
        const { complaintId } = req.params; // ID của khiếu nại gốc
        const { complaintContent } = req.body; // Chỉ lấy complaintContent từ request body

        // Kiểm tra xem nội dung phản hồi có được cung cấp không
        if (!complaintContent) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập nội dung phản hồi!"
            });
        }

        // Tìm khiếu nại gốc từ cơ sở dữ liệu và kiểm tra tính hợp lệ
        const parentComplaint = await Complaint.findById(complaintId).populate({
            path: 'request_id',
            populate: {
                path: 'user_id',
                select: 'email firstName lastName status'
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
        const newReply = new Complaint({
            user_id: user.id,
            image: parentComplaint.image,
            complaintContent: complaintContent,
            complaintType: parentComplaint.complaintType, // Lấy loại khiếu nại từ khiếu nại gốc
            request_id: parentComplaint.request_id._id,
            parentComplaint: complaintId,
            status: 'replied'
        });
        await newReply.save();
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
        parentComplaint.status = 'ok';
        await parentComplaint.save();

        res.status(201).json({
            EC: 1,
            EM: "Phản hồi khiếu nại thành công và đã gửi email đến khách hàng !",
            DT: newReply // You can send the complaint or the response data

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

// View history payment with transactionType = payment
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
const addServicePrice = async (req, res) => {
    try {
        const { serviceName, price, description, duration } = req.body;

        const name = serviceName ? serviceName.trim() : ""; // Chuẩn hóa name

        // Kiểm tra name không được để trống hoặc chỉ chứa khoảng trắng
        if (!name || name.length === 0) {
            return res.status(400).json({
                EC: 0,
                EM: "Tên dịch vụ không được để trống hoặc chỉ chứa khoảng trắng!"
            });
        }

        // Kiểm tra xem name đã tồn tại chưa (sau khi chuẩn hóa)
        const existingService = await Vip.findOne({ name });
        if (existingService) {
            return res.status(400).json({
                EC: 0,
                EM: "Tên dịch vụ đã tồn tại! Vui lòng chọn tên khác."
            });
        }

        // Kiểm tra duration (thời hạn) phải là số dương
        if (duration && (isNaN(duration) || duration <= 0)) {
            return res.status(400).json({
                EC: 0,
                EM: "Thời hạn phải là một số dương!"
            });
        }

        const servicePrice = new Vip({
            name,
            price,
            description: description ? description.trim() : description, // Chuẩn hóa description nếu có
            duration: duration || 1 // Mặc định là 1 tháng nếu không cung cấp
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
        const { id, name, price, description, duration } = req.body;

        // Kiểm tra xem id có được cung cấp không
        if (!id) {
            return res.status(400).json({
                EC: 0,
                EM: "ID dịch vụ là bắt buộc để cập nhật!"
            });
        }

        const normalizedName = name ? name.trim() : ""; // Chuẩn hóa name nếu có

        // Nếu có name mới, kiểm tra không được để trống hoặc chỉ chứa khoảng trắng
        if (normalizedName && normalizedName.length === 0) {
            return res.status(400).json({
                EC: 0,
                EM: "Tên dịch vụ không được để trống hoặc chỉ chứa khoảng trắng!"
            });
        }

        // Nếu có name mới, kiểm tra xem name đã tồn tại ở dịch vụ khác chưa
        if (normalizedName) {
            const existingService = await Vip.findOne({ name: normalizedName, _id: { $ne: id } });
            if (existingService) {
                return res.status(400).json({
                    EC: 0,
                    EM: "Tên dịch vụ đã tồn tại! Vui lòng chọn tên khác."
                });
            }
        }

        // Kiểm tra duration (thời hạn) phải là số dương nếu được cung cấp
        if (duration && (isNaN(duration) || duration <= 0)) {
            return res.status(400).json({
                EC: 0,
                EM: "Thời hạn phải là một số dương!"
            });
        }

        const updateFields = {};
        if (normalizedName) updateFields.name = normalizedName;
        if (price) updateFields.price = price;
        if (description) updateFields.description = description.trim(); // Chuẩn hóa description nếu có
        if (duration) updateFields.duration = duration; // Cập nhật duration nếu có

        // Tìm và cập nhật dịch vụ dựa trên _id
        const servicePrice = await Vip.findOneAndUpdate(
            { _id: id },
            { $set: updateFields },
            { new: true }
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
                select: "firstName lastName email phone address",
                model: User,
            })
            .populate({
                path: "ratings",
                select: "rate comment request_id", // Include request_id in the populated data
                model: Rating,
            })
            .populate({
                path: "repairman_id",
                select: "user_id",
                model: RepairmanUpgradeRequest,
                populate: {
                    path: "user_id",
                    select: "firstName lastName phone email",
                    model: User,
                }
            })
            .populate({
                path: "duePrices",
                select: "minPrice maxPrice",
                //model: DuePrice,
                populate: {
                    path: "prices",
                    select: "priceToPay",
                    //model: Price,
                }
            })
            .sort({ createdAt: -1 }); // Sort by creation date in descending order

        // Filter ratings that match the request _id
        const filteredRequests = requests.map(request => {
            const filteredRatings = request.ratings.filter(rating =>
                rating.request_id.toString() === request._id.toString()
            );
            request.ratings = filteredRatings; // Assign only the filtered ratings
            return request;
        });

        res.status(200).json({
            EC: 1,
            EM: "Lấy lịch sử đặt sửa chữa thành công!",
            DT: filteredRequests,
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





// Dashboard Admin - Service Industry CRUD ---

// User Action
const totalUsers = async (req, res) => {
    try {
        // Lấy danh sách người dùng
        const users = await User.find();

        // Tính tổng số người dùng
        const totalUsers = users.length;

        return res.status(200).json({
            EC: 1,
            EM: "Lấy tổng số người dùng thành công!",
            DT: totalUsers
        });
    } catch (err) {
        return res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const totalBannedUsers = async (req, res) => {
    try {
        // Lấy danh sách người dùng
        const users = await User.find({ status: 'Banned' })

        // Tính tổng số người dùng có trạng thái 'Banned'
        const totalBannedUsers = users.length;

        return res.status(200).json({
            EC: 1,
            EM: "Lấy số lượng người dùng bị cấm thành công!",
            DT: totalBannedUsers
        });
    } catch (err) {
        return res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const totalRepairmen = async (req, res) => {
    try {
        // Lấy danh sách user_id từ bảng Role có type là "repairman"
        const repairmanUserIds = await Role.find({ type: "repairman" }).distinct("user_id");

        // Đếm số lượng người dùng có _id nằm trong danh sách repairmanUserIds
        const totalRepairmans = await User.countDocuments({
            _id: { $in: repairmanUserIds }
        });

        return res.status(200).json({
            EC: 1,
            EM: "Lấy số lượng người dùng là thợ thành công!",
            DT: totalRepairmans
        });
    } catch (err) {
        return res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const totalCustomers = async (req, res) => {
    try {
        // Lấy danh sách user_id từ bảng Role có type là "customer"
        const customerUserIds = await Role.find({ type: "customer" }).distinct("user_id");

        // Đếm số lượng người dùng có _id nằm trong danh sách repairmanUserIds
        const totalCustomers = await User.countDocuments({
            _id: { $in: customerUserIds }
        });

        return res.status(200).json({
            EC: 1,
            EM: "Lấy số lượng người dùng là khách hàng thành công!",
            DT: totalCustomers
        });
    } catch (err) {
        return res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

// Repair booking history
const getCompletedRequestsCount = async (req, res) => {
    try {
        const completedCount = await Request.find({ status: 'Completed' });

        res.status(200).json({
            EC: 1,
            EM: "Lấy số lượng đơn hàng hoàn thành thành công!",
            DT: completedCount.length
        });
    } catch (err) {
        console.error("Lỗi khi lấy số lượng đơn hàng hoàn thành:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const getConfirmedRequestsCount = async (req, res) => {
    try {
        const confirmedCount = await Request.find({ status: 'Confirmed' });

        res.status(200).json({
            EC: 1,
            EM: "Lấy số lượng đơn hàng đã xác nhận thành công!",
            DT: confirmedCount.length
        });
    } catch (err) {
        console.error("Lỗi khi lấy số lượng đơn hàng đã xác nhận:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const getPendingRequestsCount = async (req, res) => {
    try {
        const pendingCount = await Request.find({ status: 'Pending' });

        res.status(200).json({
            EC: 1,
            EM: "Lấy số lượng đơn hàng đang chờ thành công!",
            DT: pendingCount.length
        });
    } catch (err) {
        console.error("Lỗi khi lấy số lượng đơn hàng đang chờ:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const getCancelledRequestsCount = async (req, res) => {
    try {
        const cancelledCount = await Request.find({ status: 'Cancelled' });

        res.status(200).json({
            EC: 1,
            EM: "Lấy số lượng đơn hàng đã hủy thành công!",
            DT: cancelledCount.length
        });
    } catch (err) {
        console.error("Lỗi khi lấy số lượng đơn hàng đã hủy:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const getMakePaymentRequestsCount = async (req, res) => {
    try {
        const makePaymentCount = await Request.find({ status: 'Make payment' });

        res.status(200).json({
            EC: 1,
            EM: "Lấy số lượng đơn hàng cần thanh toán thành công!",
            DT: makePaymentCount.length
        });
    } catch (err) {
        console.error("Lỗi khi lấy số lượng đơn hàng cần thanh toán:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const getDealPriceRequestsCount = async (req, res) => {
    try {
        const dealPriceCount = await Request.find({ status: 'Deal price' });

        res.status(200).json({
            EC: 1,
            EM: "Lấy số lượng đơn hàng đã thỏa thuận giá thành công!",
            DT: dealPriceCount.length
        });
    } catch (err) {
        console.error("Lỗi khi lấy số lượng đơn hàng đã thỏa thuận giá:", err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

// pending complaints
const getPendingComplaintsCount = async (req, res) => {
    try {
        // Tính tổng số khiếu nại có trạng thái 'pending'
        const pendingCount = await Complaint.find({ status: 'pending' });

        res.status(200).json({
            EC: 1,
            EM: "Lấy tổng số khiếu nại đang chờ xử lý thành công!",
            DT: pendingCount.length
        });
    } catch (error) {
        console.error("Error getting pending complaints count:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

// pending upgrade requests
const getPendingUpgradeRequestsCount = async (req, res) => {
    try {
        // Tính tổng số khiếu nại có trạng thái 'pending'
        const pendingCount = await Request.find({ status: 'pending' });

        res.status(200).json({
            EC: 1,
            EM: "Lấy tổng số yêu cầu nâng cấp tài khoản thợ đang chờ xử lý thành công!",
            DT: pendingCount.length
        });
    } catch (error) {
        console.error("Error getting pending complaints count:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const totalServiceIndustries = async (req, res) => {
    try {
        // Tính tổng số chuyên mục trong bảng ServiceIndustry
        const totalCount = ServiceIndustry.length;

        res.status(200).json({
            EC: 1,
            EM: "Lấy tổng số chuyên mục thành công!",
            DT: totalCount
        });
    } catch (err) {
        console.error('Error counting service industries:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const totalServicesByIndustry = async (req, res) => {
    try {
        // Fetch tất cả dịch vụ và populate serviceIndustry_id để lấy thông tin chuyên mục
        const services = await Service.aggregate([
            {
                $group: {
                    _id: "$serviceIndustry_id", // Group by serviceIndustry_id
                    totalServices: { $sum: 1 } // Đếm tổng số dịch vụ theo mỗi serviceIndustry_id
                }
            },
            {
                $lookup: {
                    from: "serviceindustries", // Tên bảng serviceIndustry
                    localField: "_id",         // Trường serviceIndustry_id trong Service
                    foreignField: "_id",       // Trường _id trong bảng ServiceIndustry
                    as: "serviceIndustry"     // Tạo một trường mới chứa thông tin chuyên mục
                }
            },
            {
                $unwind: "$serviceIndustry" // Giải nén thông tin chuyên mục
            },
            {
                $project: {
                    _id: 0, // Loại bỏ trường _id
                    serviceIndustry: "$serviceIndustry.type", // Chỉ lấy tên loại chuyên mục
                    totalServices: 1 // Tổng số dịch vụ
                }
            }
        ]);

        res.status(200).json({
            EC: 1,
            EM: "Lấy tổng số dịch vụ theo từng loại chuyên mục thành công!",
            DT: services
        });
    } catch (err) {
        console.error('Error counting services by industry:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const totalServicePrices = async (req, res) => {
    try {
        const servicePriceCount = Vip.length;

        res.status(200).json({
            EC: 1,
            EM: "Lấy tổng số loại dịch vụ tăng đề xuất thành công",
            DT: servicePriceCount
        })
    } catch (error) {
        console.error("Error getting total service prices:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi lấy tổng số loại dịch vụ tăng đề xuất. Vui lòng thử lại sau!"
        });
    }
}
const viewPendingSupplementaryCertificates = async (req, res) => {
    try {
        // Find all RepairmanUpgradeRequests with status "In review"
        const pendingCertificates = await RepairmanUpgradeRequest.find({ status: "In review" })
            .populate("user_id", "firstName lastName email phone address imgAvt") // Populate user details
            .populate("serviceIndustry_id", "type") // Populate service industry details
            .populate("vip_id", "name price"); // Populate VIP details

        if (!pendingCertificates || pendingCertificates.length === 0) {
            return res.status(404).json({
                EC: 0,
                EM: "Không có yêu cầu bổ sung chứng chỉ hành nghề nào !",
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách yêu cầu bổ sung chứng chỉ thành công!",
            DT: pendingCertificates,
        });
    } catch (error) {
        console.error("Error fetching pending supplementary certificates:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
        });
    }
};

const verifyPracticeCertificate = async (req, res) => {
    const { requestId, action, rejectionReason } = req.body;

    try {
        // Find the repairman upgrade request by certificate ID
        const repairmanRequest = await RepairmanUpgradeRequest.findById(requestId).populate("user_id", "email firstName lastName");

        if (!repairmanRequest) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy yêu cầu nâng cấp thợ sửa chữa!",
            });
        }

        // Check if the request has already been processed
        if (repairmanRequest.status === "Second certificate approved" || repairmanRequest.status === "Second certificate rejected") {
            return res.status(400).json({
                EC: 0,
                EM: "Yêu cầu bổ sung chứng chỉ đã được xử lý trước đó!",
            });
        }

        // Check the action (approve or reject)
        if (action === "approve") {
            repairmanRequest.status = "Second certificate approved"; // Update status in RepairmanUpgradeRequest
            await repairmanRequest.save();

            // Send approval email
            const emailContent = `
                <h3>Chứng chỉ bổ sung của bạn đã được phê duyệt!</h3>
                <p>Xin chào ${repairmanRequest.user_id.firstName} ${repairmanRequest.user_id.lastName},</p>
                <p>Chứng chỉ bổ sung của bạn đã được phê duyệt thành công. Cảm ơn bạn đã cung cấp thông tin!</p>
            `;
            await sendEmail(repairmanRequest.user_id.email, "Chứng chỉ bổ sung được phê duyệt", emailContent);

            return res.status(200).json({
                EC: 1,
                EM: "Chứng chỉ bổ sung đã được phê duyệt và email đã được gửi!",
            });
        } else if (action === "reject") {
            if (!rejectionReason) {
                return res.status(400).json({
                    EC: 0,
                    EM: "Vui lòng cung cấp lý do từ chối!",
                });
            }

            // Clear all images from supplementaryPracticeCertificate
            repairmanRequest.supplementaryPracticeCertificate = [];
            repairmanRequest.status = "Second certificate rejected"; // Update status in RepairmanUpgradeRequest
            await repairmanRequest.save();
            console.log("Ảnh chứng chỉ bổ sung đã được xóa!");

            // Send rejection email
            const emailContent = `
                <h3>Chứng chỉ bổ sung của bạn đã bị từ chối</h3>
                <p>Xin chào ${repairmanRequest.user_id.firstName} ${repairmanRequest.user_id.lastName},</p>
                <p>Chứng chỉ bổ sung của bạn đã bị từ chối với lý do sau:</p>
                <p><strong>${rejectionReason}</strong></p>
                <p>Vui lòng kiểm tra lại và gửi lại thông tin chính xác.</p>
            `;
            await sendEmail(repairmanRequest.user_id.email, "Chứng chỉ bổ sung bị từ chối", emailContent);

            return res.status(200).json({
                EC: 1,
                EM: "Chứng chỉ bổ sung đã bị từ chối, email đã được gửi!",
            });
        } else {
            return res.status(400).json({
                EC: 0,
                EM: "Hành động không hợp lệ! Vui lòng chọn 'approve' hoặc 'reject'.",
            });
        }
    } catch (error) {
        console.error("Error in verifyPracticeCertificate:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
        });
    }
};
//View repairman monthly payment
const getRepairmanMonthlyPaymentById = async (req, res) => {
    try {
        const monthlyPaymentId = req.params.id;
        const transaction = await Transaction.findById(monthlyPaymentId)
            .populate({
                path: 'wallet_id',
                populate: { path: 'user_id', select: 'firstName lastName email' }
            });

        if (!transaction) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy giao dịch!"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Lấy thông tin giao dịch thành công!",
            DT: transaction
        });
    } catch (error) {
        console.error("Lấy thông tin giao dịch thất bại:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};


const getAllRepairmanMonthlyPayments = async (req, res) => {
    try {
        let { page = 1, limit = 10, search = "", balance = "" } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const filter = {
            content: "Thanh toán phí thành viên hàng tháng",
            status: 1
        };

        // Search theo content
        if (search) {
            filter.content = { $regex: search, $options: "i" };
        }

        // Tìm kiếm theo số dư sau giao dịch
        if (!isNaN(balance) && balance.trim() !== "") {
            filter.balanceAfterTransact = parseFloat(balance);
        }

        const transactions = await Transaction.find(filter)
            .populate({
                path: 'wallet_id',
                populate: { path: 'user_id', select: 'firstName lastName email' }
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalTransactions = await Transaction.countDocuments(filter);

        res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách giao dịch thành công!",
            DT: {
                transactions,
                currentPage: page,
                totalPages: Math.ceil(totalTransactions / limit),
                totalTransactions
            }
        });
    } catch (error) {
        console.error("Lấy danh sách giao dịch thất bại:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const getMostUsedVipService = async (req, res) => {
    try {
        const result = await RepairmanUpgradeRequest.aggregate([
            {
                $match: {
                    vip_id: { $ne: null },
                },
            },
            {
                $group: {
                    _id: "$vip_id",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: "vips",
                    localField: "_id",
                    foreignField: "_id",
                    as: "vipInfo",
                },
            },
            {
                $unwind: "$vipInfo",
            },
            {
                $project: {
                    _id: 0,
                    vip_id: "$_id",
                    vip_name: "$vipInfo.name",
                    usage_count: "$count",
                },
            }
        ]);

        if (!result.length) {
            return res.status(200).json({
                EC: 1,
                EM: "Không có dữ liệu loại VIP nào!",
                DT: null
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Lấy loại VIP phổ biến được thợ sử dụng nhiều nhất thành công!",
            DT: result[0].vip_name
        });
    } catch (error) {
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};
const getAllProfit = async (req, res) => {
    try {
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng cung cấp năm và tháng để tính tổng số tiền!",
            });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);
        const prefixes = ["REC-SEV", "VIPFEE", "VIP"];

        console.log("Start Date:", startDate, "End Date:", endDate);

        // Tính tổng tiền gốc của REC-SEV trước khi lấy 10%
        const totalRecSevOriginal = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    payCode: { $regex: "^REC-SEV" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const originalRecSevTotal = totalRecSevOriginal.length > 0 ? totalRecSevOriginal[0].totalAmount : 0;
        console.log("Original REC-SEV Total:", originalRecSevTotal);

        const totalAmounts = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    $or: prefixes.map(prefix => ({ payCode: { $regex: `^${prefix}` } }))
                }
            },
            {
                $project: {
                    payCode: 1,
                    amount: 1,
                    prefix: {
                        $switch: {
                            branches: prefixes.map(prefix => ({
                                case: { $regexMatch: { input: "$payCode", regex: new RegExp(`^${prefix}`) } },
                                then: prefix
                            })),
                            default: "OTHER"
                        }
                    },
                    adjustedAmount: {
                        $cond: [
                            { $regexMatch: { input: "$payCode", regex: /^REC-SEV/ } },
                            { $multiply: ["$amount", 0.1] },
                            "$amount"
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$prefix",
                    totalAmount: { $sum: "$adjustedAmount" }
                }
            }
        ]);

        console.log("Total Amounts by Prefix:", totalAmounts);

        // Tính tổng số tiền của tất cả giao dịch trong tháng
        const totalAllTransactions = await Transaction.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        console.log("Total of all transactions:", totalAllTransactions.length > 0 ? totalAllTransactions[0].totalAmount : 0);

        const totalsProfit = totalAmounts.reduce((acc, item) => {
            acc[item._id] = item.totalAmount;
            return acc;
        }, {});

        // Đổi tên các loại phí
        const renamedTotalsProfit = {
            "phí đăng kí thành viên": totalsProfit["VIPFEE"] || 0,
            "phí hoa hồng sửa chữa": totalsProfit["REC-SEV"] || 0,
            "phí đăng kí gói vip": totalsProfit["VIP"] || 0
        };

        console.log("Calculated 10% of REC-SEV:", renamedTotalsProfit["phí hoa hồng sửa chữa"]);

        res.status(200).json({
            EC: 1,
            EM: "Tính tổng lợi nhuận theo tháng thành công!",
            DT: {
                totalsProfit: renamedTotalsProfit,
                totalAll: totalAllTransactions.length > 0 ? totalAllTransactions[0].totalAmount : 0
            }
        });
    } catch (error) {
        console.error("Error calculating total amount by prefixes and month:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};


const getYearlyProfit = async (req, res) => {
    try {
        const { year } = req.query; // Nếu không có year, trả về dữ liệu cho tất cả các năm

        const prefixes = ["REC-SEV", "VIPFEE", "VIP"];
        let matchCondition = {
            $or: prefixes.map(prefix => ({ payCode: { $regex: `^${prefix}` } })),
        };

        if (year) {
            const startDate = new Date(year, 0, 1); // Ngày 1/1 của năm
            const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // Ngày 31/12 của năm
            matchCondition.createdAt = { $gte: startDate, $lte: endDate };
        }

        // Tính tổng doanh thu theo loại phí, năm, tháng và ngày
        const totalAmounts = await Transaction.aggregate([
            { $match: matchCondition },
            {
                $project: {
                    payCode: 1,
                    amount: 1,
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" }, // Thêm ngày
                    prefix: {
                        $switch: {
                            branches: prefixes.map(prefix => ({
                                case: { $regexMatch: { input: "$payCode", regex: new RegExp(`^${prefix}`) } },
                                then: prefix,
                            })),
                            default: "OTHER",
                        },
                    },
                    adjustedAmount: {
                        $cond: [
                            { $regexMatch: { input: "$payCode", regex: /^REC-SEV/ } },
                            { $multiply: ["$amount", 0.1] }, // 10% cho REC-SEV
                            "$amount",
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: "$year",
                        month: "$month",
                        day: "$day", // Nhóm theo ngày
                        prefix: "$prefix",
                    },
                    totalAmount: { $sum: "$adjustedAmount" },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
            },
        ]);

        // Tính tổng tất cả giao dịch theo năm, tháng và ngày
        const totalAllTransactions = await Transaction.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" }, // Nhóm theo ngày
                    },
                    totalAmount: { $sum: "$amount" },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
            },
        ]);

        // Tổ chức dữ liệu theo năm, tháng và ngày
        const yearlyProfit = {};
        totalAmounts.forEach(item => {
            const { year, month, day, prefix } = item._id;
            if (!yearlyProfit[year]) yearlyProfit[year] = {};
            if (!yearlyProfit[year][month]) yearlyProfit[year][month] = {};
            if (!yearlyProfit[year][month][day]) yearlyProfit[year][month][day] = {};
            yearlyProfit[year][month][day][prefix] = item.totalAmount;
        });

        // Đổi tên loại phí
        const renamedYearlyProfit = {};
        Object.keys(yearlyProfit).forEach(year => {
            renamedYearlyProfit[year] = {};
            Object.keys(yearlyProfit[year]).forEach(month => {
                renamedYearlyProfit[year][month] = {};
                Object.keys(yearlyProfit[year][month]).forEach(day => {
                    const profit = yearlyProfit[year][month][day];
                    renamedYearlyProfit[year][month][day] = {
                        "phí đăng kí thành viên": profit["VIPFEE"] || 0,
                        "phí hoa hồng sửa chữa": profit["REC-SEV"] || 0,
                        "phí đăng kí gói vip": profit["VIP"] || 0,
                    };
                });
            });
        });

        // Tổ chức totalAll theo năm, tháng và ngày
        const totalAllByYear = {};
        totalAllTransactions.forEach(item => {
            const { year, month, day } = item._id;
            if (!totalAllByYear[year]) totalAllByYear[year] = {};
            if (!totalAllByYear[year][month]) totalAllByYear[year][month] = {};
            totalAllByYear[year][month][day] = item.totalAmount;
        });

        res.status(200).json({
            EC: 1,
            EM: "Lấy doanh thu theo năm thành công!",
            DT: {
                yearlyProfit: renamedYearlyProfit,
                totalAll: totalAllByYear,
            },
        });
    } catch (error) {
        console.error("Error calculating yearly profit:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
        });
    }
};

const getRequestStatusByMonth = async (req, res) => {
    try {
        const { year, month } = req.query;
        if (!year || !month) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng cung cấp đầy đủ năm và tháng.",
            });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const results = await Request.aggregate([
            {
                $match: {
                    $or: [
                        { createdAt: { $gte: startDate, $lte: endDate } },
                        { updatedAt: { $gte: startDate, $lte: endDate } },
                    ],
                    status: { $in: ["Completed", "Cancelled"] },
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const response = {
            Completed: 0,
            Cancelled: 0,
        };

        results.forEach((item) => {
            response[item._id] = item.count;
        });

        return res.status(200).json({
            EC: 1,
            EM: "Thống kê theo tháng thành công!",
            DT: response,
        });
    } catch (error) {
        console.error("Lỗi khi thống kê theo tháng:", error);
        return res.status(500).json({
            EC: 0,
            EM: "Đã xảy ra lỗi. Vui lòng thử lại!",
        });
    }
};

const getRequestStatusByYear = async (req, res) => {
    try {
        const { year } = req.query;
        if (!year) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng cung cấp năm.",
            });
        }

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

        const results = await Request.aggregate([
            {
                $match: {
                    $or: [
                        { createdAt: { $gte: startDate, $lte: endDate } },
                        { updatedAt: { $gte: startDate, $lte: endDate } },
                    ],
                    status: { $in: ["Completed", "Cancelled"] },
                },
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const response = {
            Completed: 0,
            Cancelled: 0,
        };

        results.forEach((item) => {
            response[item._id] = item.count;
        });

        return res.status(200).json({
            EC: 1,
            EM: "Thống kê theo năm thành công!",
            DT: response,
        });
    } catch (error) {
        console.error("Lỗi khi thống kê theo năm:", error);
        return res.status(500).json({
            EC: 0,
            EM: "Đã xảy ra lỗi. Vui lòng thử lại!",
        });
    }
};
const getPosts = async (req, res) => {
    try {
        const posts = await ForumPost.find({ status: "pending" })
            .populate({
                path: "user_id",
                select: "firstName lastName",
                populate: {
                    path: "roles",
                    select: "type"
                }
            })
            .populate({
                path: "serviceIndustry_id",
                select: "type",
            })
            .populate({
                path: "forumComments",
                populate: {
                    path: "user_id",
                    select: "firstName lastName"
                }
            })

        res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách bài đăng thành công!",
            DT: {
                posts
            }
        });
    } catch (error) {
        res.status(400).json({
            EC: 0,
            EM: "Lỗi khi lấy danh sách bài đăng!",
            DT: error.message
        });
    }
};

// Moderate posts/comments
// const moderate = async (req, res) => {
//     try {
//         const { post_id } = req.params;
//         const { action } = req.body; // type: 'post' or 'comment', action: 'approve' or 'delete'

//         const posts = await ForumPost.findById(post_id)
//         if (action === 'approve') {
//             posts.status = 'active';
//             await posts.save();
//             res.status(200).json({
//                 EC: 1,
//                 EM: `Bài đăng đã được duyệt!`,

//             });
//         } else if (action === 'reject') {
//             posts.status = 'deleted';
//             await posts.save();
//             return res.status(200).json({
//                 EC: 1,
//                 EM: `Bài đăng không được duyệt!`,

//             });
//         }


//     } catch (error) {
//         res.status(400).json({
//             EC: 0,
//             EM: "Lỗi khi kiểm duyệt!",
//             DT: error.message
//         });
//     }
// };

const moderate = async (req, res) => {
    try {
        const { post_id } = req.params;
        const { action, rejectionReason } = req.body; // Added rejectionReason

        // Find the post and populate user_id
        const post = await ForumPost.findById(post_id).populate(
            "user_id",
            "email firstName lastName"
        );

        if (!post) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy bài đăng!",
            });
        }

        // Check if the post has already been processed
        if (post.status === "active" || post.status === "deleted") {
            return res.status(400).json({
                EC: 0,
                EM: "Bài đăng đã được xử lý trước đó!",
            });
        }

        if (action === "approve") {
            post.status = "active";
            await post.save();

            // Send approval email
            const emailContent = `
          <h3>Bài đăng của bạn đã được phê duyệt!</h3>
          <p>Xin chào ${post.user_id.firstName} ${post.user_id.lastName},</p>
          <p>Bài đăng "${post.title}" của bạn đã được phê duyệt và hiện đã xuất hiện trên diễn đàn. Cảm ơn bạn đã đóng góp!</p>
        `;
            await sendEmail(
                post.user_id.email,
                "Bài đăng diễn đàn được phê duyệt",
                emailContent
            );

            return res.status(200).json({
                EC: 1,
                EM: "Bài đăng đã được duyệt và email đã được gửi!",
            });
        } else if (action === "reject") {
            if (!rejectionReason) {
                return res.status(400).json({
                    EC: 0,
                    EM: "Vui lòng cung cấp lý do từ chối!",
                });
            }

            post.status = "deleted";
            await post.save();

            // Send rejection email
            const emailContent = `
          <h3>Bài đăng của bạn đã bị từ chối</h3>
          <p>Xin chào ${post.user_id.firstName} ${post.user_id.lastName},</p>
          <p>Bài đăng "${post.title}" của bạn đã bị từ chối với lý do sau:</p>
          <p><strong>${rejectionReason}</strong></p>
          <p>Vui lòng chỉnh sửa và gửi lại bài đăng nếu cần.</p>
        `;
            await sendEmail(
                post.user_id.email,
                "Bài đăng diễn đàn bị từ chối",
                emailContent
            );

            return res.status(200).json({
                EC: 1,
                EM: "Bài đăng đã bị từ chối và email đã được gửi!",
            });
        } else {
            return res.status(400).json({
                EC: 0,
                EM: "Hành động không hợp lệ! Vui lòng chọn 'approve' hoặc 'reject'.",
            });
        }
    } catch (error) {
        console.error("Error in moderate:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra khi kiểm duyệt. Vui lòng thử lại!",
            DT: error.message,
        });
    }
};
const getGuideslist = async (req, res) => {
    try {
        const guides = await Guide.find();

        if (!guides || guides.length === 0) {
            return res.status(404).json({
                EC: 0,
                EM: "Không có hướng dẫn nào được tìm thấy!",
                DT: [],
            });

        }
        return res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách hướng dẫn thành công!",
            DT: guides,
        });
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách hướng dẫn:", error);
        return res.status(500).json({
            EC: 0,
            EM: "Đã xảy ra lỗi. Vui lòng thử lại!",
        });
    }
}
const getGuildebyId = async (req, res) => {
    const { id } = req.params;
    try {
        const guide = await Guide.findById(id);

        if (!guide) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy hướng dẫn với ID này!",
            });
        }

        return res.status(200).json({
            EC: 1,
            EM: "Lấy thông tin hướng dẫn thành công!",
            DT: guide,
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin hướng dẫn:", error);
        return res.status(500).json({
            EC: 0,
            EM: "Đã xảy ra lỗi. Vui lòng thử lại!",
        });
    }
}

const addGuide = async (req, res) => {
    try {
        // Lấy dữ liệu từ body request
        const { title, type, description, category, tags } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!title || !type) {
            return res.status(400).json({
                EC: 0,
                EM: "Thiếu thông tin bắt buộc! Vui lòng cung cấp title và type.",
            });
        }

        // Kiểm tra giá trị hợp lệ cho type
        if (!['video', 'article', 'images'].includes(type)) {
            return res.status(400).json({
                EC: 0,
                EM: "Loại hướng dẫn không hợp lệ! Chỉ chấp nhận 'video', 'article' hoặc 'images'.",
            });
        }

        // Xử lý file upload từ Cloudinary
        const content = req.files.map(file => file.path); // Lấy URL từ Cloudinary

        // Tạo mới guide
        const newGuide = new Guide({
            title,
            type,
            content, // Lưu mảng URL từ Cloudinary
            description,
            category,
            tags,
        });

        // Lưu guide vào cơ sở dữ liệu
        await newGuide.save();

        // Trả về kết quả thành công
        return res.status(201).json({
            EC: 1,
            EM: "Thêm hướng dẫn thành công!",
            DT: newGuide,
        });
    } catch (error) {
        console.error("Error adding guide:", error);
        return res.status(500).json({
            EC: 0,
            EM: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
        });
    }
};
const getGuideByUser = async (req, res) => {
    const userId = req.user.id;
    try {
        // Tìm tất cả các guides được tạo bởi userId
        const guides = await Guide.find({ user_id: userId });

        // Kiểm tra nếu không có guides nào
        if (!guides || guides.length === 0) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy hướng dẫn nào cho người dùng này!",
                DT: [],
            });
        }

        // Trả về danh sách guides
        return res.status(200).json({
            EC: 1,
            EM: "Lấy danh sách hướng dẫn thành công!",
            DT: guides,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách hướng dẫn theo user_id:", error);
        return res.status(500).json({
            EC: 0,
            EM: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
        });
    }
};

// const updateGuide = async (req, res) => {
//     const { id } = req.params;
//     const { title, type, description, category, tags } = req.body;

//     try {
//         // Kiểm tra xem guide có tồn tại không
//         const guide = await Guide.findById(id);
//         if (!guide) {
//             return res.status(404).json({
//                 EC: 0,
//                 EM: "Hướng dẫn không tồn tại",
//             });
//         }

//         // Kiểm tra giá trị hợp lệ cho type
//         if (type && !['video', 'article', 'images'].includes(type)) {
//             return res.status(400).json({
//                 EC: 0,
//                 EM: "Loại hướng dẫn không hợp lệ! Chỉ chấp nhận 'video', 'article' hoặc 'images'.",
//             });
//         }

//         // Xử lý file upload từ Cloudinary nếu có file mới
//         let content = guide.content; // Giữ nguyên nội dung cũ nếu không có file mới
//         if (req.files && req.files.length > 0) {
//             content = req.files.map(file => file.path); // Lấy URL từ Cloudinary
//         }

//         // Cập nhật thông tin guide
//         guide.title = title || guide.title;
//         guide.type = type || guide.type;
//         guide.description = description || guide.description;
//         guide.category = category || guide.category;
//         guide.tags = tags || guide.tags;
//         guide.content = content;

//         // Lưu guide đã cập nhật vào cơ sở dữ liệu
//         await guide.save();

//         // Trả về kết quả thành công
//         return res.status(200).json({
//             EC: 1,
//             EM: "Cập nhật hướng dẫn thành công!",
//             DT: guide,
//         });
//     } catch (error) {
//         console.error("Error updating guide:", error);
//         return res.status(500).json({
//             EC: 0,
//             EM: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
//         });
//     }
// };

const updateGuide = async (req, res) => {
    const { id } = req.params;
    const { title, type, description, category, tags, existingContent } = req.body;

    try {
        // Kiểm tra xem guide có tồn tại không
        const guide = await Guide.findById(id);
        if (!guide) {
            return res.status(404).json({
                EC: 0,
                EM: "Hướng dẫn không tồn tại",
            });
        }

        // Kiểm tra giá trị hợp lệ cho type
        if (type && !['video', 'article', 'images'].includes(type)) {
            return res.status(400).json({
                EC: 0,
                EM: "Loại hướng dẫn không hợp lệ! Chỉ chấp nhận 'video', 'article' hoặc 'images'.",
            });
        }

        // Xử lý danh sách nội dung
        let content = [];
        // Thêm URL hiện có (nếu có)
        if (existingContent) {
            content = JSON.parse(existingContent); // Parse chuỗi JSON thành mảng
        }
        // Thêm URL từ file mới (nếu có)
        if (req.files && req.files.length > 0) {
            const newUrls = req.files.map(file => file.path);
            content = [...content, ...newUrls];
        }

        // Chuyển chuỗi tags thành mảng (nếu tags là chuỗi)
        const tagsArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : (tags || guide.tags);

        // Cập nhật thông tin guide
        guide.title = title || guide.title;
        guide.type = type || guide.type;
        guide.description = description || guide.description;
        guide.category = category || guide.category;
        guide.tags = tagsArray;
        guide.content = content;

        // Lưu guide đã cập nhật
        await guide.save();

        // Trả về kết quả thành công
        return res.status(200).json({
            EC: 1,
            EM: "Cập nhật hướng dẫn thành công!",
            DT: guide,
        });
    } catch (error) {
        console.error("Error updating guide:", error);
        return res.status(500).json({
            EC: 0,
            EM: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
        });
    }
};
const deleteGuide = async (req, res) => {
    const { id } = req.params;

    try {
        // Kiểm tra xem guide có tồn tại không
        const guide = await Guide.findById(id);
        if (!guide) {
            return res.status(404).json({
                EC: 0,
                EM: "Hướng dẫn không tồn tại!",
            });
        }

        // Xóa hướng dẫn
        await Guide.findByIdAndDelete(id);

        // Trả về kết quả thành công
        return res.status(200).json({
            EC: 1,
            EM: "Xóa hướng dẫn thành công!",
        });
    } catch (error) {
        console.error("Error deleting guide:", error);
        return res.status(500).json({
            EC: 0,
            EM: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
        });
    }
};
const checkVipExpiration = async (req, res) => {
    try {
        // Lấy tất cả các giao dịch có `payCode` bắt đầu bằng "VIP"
        const vipTransactions = await Transaction.find({
            payCode: { $regex: /^VIP/ }, // Tìm các giao dịch có `payCode` bắt đầu bằng "VIP"
            transactionType: "payment", // Chỉ lấy giao dịch thanh toán
            status: 1, // Chỉ lấy giao dịch thành công
        }).populate({
            path: "wallet_id",
            populate: { path: "user_id", select: "firstName lastName email" }, // Lấy thông tin người dùng
        });

        if (!vipTransactions || vipTransactions.length === 0) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy giao dịch VIP nào!",
                DT: [],
            });
        }

        const currentDate = new Date();
        const expiredUsers = [];
        const activeUsers = [];

        // Duyệt qua từng giao dịch để kiểm tra ngày hết hạn
        for (const transaction of vipTransactions) {
            // Kiểm tra nếu `wallet_id` hoặc `user_id` bị null
            if (!transaction.wallet_id || !transaction.wallet_id.user_id) {
                console.log(`Giao dịch không hợp lệ: ${transaction._id}`);
                continue; // Bỏ qua giao dịch không hợp lệ
            }

            const user = transaction.wallet_id.user_id; // Lấy thông tin người dùng
            const vipStartDate = transaction.createdAt; // Ngày bắt đầu từ giao dịch

            // Tìm gói VIP liên quan đến giao dịch
            const repairmanRequest = await RepairmanUpgradeRequest.findOne({
                user_id: user._id,
                vip_id: { $ne: null }, // Chỉ lấy các yêu cầu có gói VIP
            }).populate("vip_id"); // Lấy thông tin gói VIP

            if (!repairmanRequest || !repairmanRequest.vip_id) {
                console.log(`Không tìm thấy gói VIP cho user_id: ${user._id}`);
                continue; // Bỏ qua nếu không tìm thấy gói VIP
            }

            const vipPackage = repairmanRequest.vip_id; // Gói VIP
            const vipExpiryDate = new Date(vipStartDate);
            vipExpiryDate.setMonth(vipExpiryDate.getMonth() + vipPackage.duration); // Tính ngày hết hạn

            // Kiểm tra ngày hết hạn
            if (currentDate > vipExpiryDate) {
                expiredUsers.push({
                    user: {
                        id: user._id,
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                    },
                    vipStartDate,
                    vipExpiryDate,
                    status: "Expired",
                });

                // Cập nhật trạng thái nếu cần
                // repairmanRequest.status = "Inactive";
                // await repairmanRequest.save();
            } else {
                activeUsers.push({
                    user: {
                        id: user._id,
                        name: `${user.firstName} ${user.lastName}`,
                        email: user.email,
                    },
                    vipStartDate,
                    vipExpiryDate,
                    status: "Active",
                });
            }
        }

        // Tính số lượng người dùng
        const expiredCount = expiredUsers.length;
        const activeCount = activeUsers.length;

        // Trả về kết quả
        return res.status(200).json({
            EC: 1,
            EM: "Kiểm tra trạng thái VIP thành công!",
            DT: {
                expiredUsers,
                activeUsers,
                expiredCount,
                activeCount,
            },
        });
    } catch (error) {
        console.error("Error in checkVipExpiration:", error);
        return res.status(500).json({
            EC: 0,
            EM: "Đã xảy ra lỗi. Vui lòng thử lại sau!",
        });
    }
};

// const checkVipExpirationAndSendEmails = async () => {
//     try {
//       const currentDate = new Date();

//       // Lấy tất cả các giao dịch có `payCode` bắt đầu bằng "VIP"
//       const vipTransactions = await Transaction.find({
//         payCode: { $regex: /^VIP/ },
//         transactionType: "payment",
//         status: 1,
//       }).populate({
//         path: "wallet_id",
//         populate: { path: "user_id", select: "firstName lastName email" },
//       });

//       if (!vipTransactions || vipTransactions.length === 0) {
//         console.log("Không tìm thấy giao dịch VIP nào!");
//         return;
//       }

//       for (const transaction of vipTransactions) {
//         // Kiểm tra nếu `wallet_id` hoặc `user_id` bị null
//         if (!transaction.wallet_id || !transaction.wallet_id.user_id) {
//           console.log(`Giao dịch không hợp lệ: ${transaction._id}`);
//           continue; // Bỏ qua giao dịch không hợp lệ
//         }

//         const user = transaction.wallet_id.user_id; // Lấy thông tin người dùng
//         const vipStartDate = transaction.createdAt; // Ngày bắt đầu từ giao dịch

//         // Tìm gói VIP liên quan đến giao dịch
//         const repairmanRequest = await RepairmanUpgradeRequest.findOne({
//           user_id: user._id,
//           vip_id: { $ne: null },
//         }).populate("vip_id");

//         if (!repairmanRequest || !repairmanRequest.vip_id) {
//           console.log(`Không tìm thấy gói VIP cho user_id: ${user._id}`);
//           continue; // Bỏ qua nếu không tìm thấy gói VIP
//         }

//         const vipPackage = repairmanRequest.vip_id; // Gói VIP
//         const vipExpiryDate = new Date(vipStartDate);
//         vipExpiryDate.setMonth(vipExpiryDate.getMonth() + vipPackage.duration); // Tính ngày hết hạn

//         // Tính thời gian còn lại
//         const daysUntilExpiry = Math.ceil((vipExpiryDate - currentDate) / (1000 * 60 * 60 * 24));

//         // Gửi email trước 3 ngày hết hạn
//         if (daysUntilExpiry === 3) {
//           const emailContent = `
//             <h1>Thông báo sắp hết hạn gói VIP</h1>
//             <p>Xin chào ${user.firstName} ${user.lastName},</p>
//             <p>Gói VIP của bạn sẽ hết hạn vào ngày ${vipExpiryDate.toISOString().split("T")[0]}.</p>
//             <p>Vui lòng gia hạn để tiếp tục sử dụng các dịch vụ của chúng tôi.</p>
//           `;
//           await sendEmail(user.email, "Thông báo sắp hết hạn gói VIP", emailContent);
//           console.log(`Đã gửi email nhắc nhở trước 3 ngày cho user_id: ${user._id}`);
//         }

//         // Gửi email sau khi hết hạn
//         if (daysUntilExpiry < 0) {
//           const emailContent = `
//             <h1>Thông báo gói VIP đã hết hạn</h1>
//             <p>Xin chào ${user.firstName} ${user.lastName},</p>
//             <p>Gói VIP của bạn đã hết hạn vào ngày ${vipExpiryDate.toISOString().split("T")[0]}.</p>
//             <p>Vui lòng gia hạn để tiếp tục sử dụng các dịch vụ của chúng tôi.</p>
//           `;
//           await sendEmail(user.email, "Thông báo gói VIP đã hết hạn", emailContent);
//           console.log(`Đã gửi email thông báo hết hạn cho user_id: ${user._id}`);
//         }
//       }

//       console.log("Hoàn thành kiểm tra và gửi email VIP.");
//     } catch (error) {
//       console.error("Error in checkVipExpirationAndSendEmails:", error);
//     }
//   };

//   cron.schedule("0 0 * * *", () => {
//       console.log("Bắt đầu kiểm tra trạng thái VIP và gửi email...");
//       checkVipExpirationAndSendEmails()
//     });

module.exports = {
    getRequestStatusByYear,
    getRequestStatusByMonth,
    getYearlyProfit,
    totalServicePrices,
    totalServicesByIndustry,
    totalServiceIndustries,
    totalBannedUsers,
    getPendingUpgradeRequestsCount,
    getPendingComplaintsCount,
    getCompletedRequestsCount,
    getDealPriceRequestsCount,
    getMakePaymentRequestsCount,
    getCancelledRequestsCount,
    getPendingRequestsCount,
    getConfirmedRequestsCount,
    totalUsers,
    totalCustomers,
    totalRepairmen,
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
    viewPendingSupplementaryCertificates,
    verifyPracticeCertificate,
    getRepairmanMonthlyPaymentById,
    getAllRepairmanMonthlyPayments,
    getMostUsedVipService,
    getAllProfit,
    getPosts,
    moderate,
    getGuideslist,
    getGuildebyId,
    getGuideByUser,
    addGuide,
    updateGuide,
    deleteGuide,
    checkVipExpiration
};

