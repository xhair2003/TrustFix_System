const { User, Role, RepairmanUpgradeRequest, ServiceIndustry, Service, Vip, DuePrice, Price, Rating, Request, Transaction, Wallet } = require("../models");
const cloudinary = require("../../config/cloudinary");
const { MONTHLY_FEE } = require("../constants");
const { findOne } = require("../models/RepairmanUpgradeRequest");
const nodemailer = require('nodemailer'); // Import nodemailer để gửi email

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
        EM: "Không tìm thấy loại dịch vụ nào!",
      });
    }

    // Trả về danh sách các loại dịch vụ
    res.status(200).json({
      EC: 1,
      DT: serviceTypes,
      EM: "Lấy loại dịch vụ thành công",
    });
  } catch (err) {
    console.error("Error fetching service types:", err);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
    });
  }
};

const requestRepairmanUpgrade = async (req, res) => {
  try {
    const userId = req.user.id; // User ID from verified token

    const { serviceType, address, description } = req.body;

    console.log("address", address);

    // Validate required fields
    if (!serviceType || !address || !description) {
      return res.status(400).json({
        EC: 0,
        EM: "Vui lòng điền đầy đủ thông tin yêu cầu nâng cấp!",
      });
    }

    // Check if user is customer
    const userRole = await Role.findOne({ user_id: userId });
    if (!userRole || userRole.type !== "customer") {
      return res.status(403).json({
        EC: 0,
        EM: "Bạn không có quyền thực hiện nâng cấp này!",
      });
    }

    // Find service industry by type
    const serviceIndustry = await ServiceIndustry.findOne({
      type: serviceType,
    }); // Tìm ServiceIndustry bằng serviceType
    if (!serviceIndustry) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy loại hình dịch vụ!",
      });
    }

    let imgCertificatePracticeUrls = [];
    let imgCCCDUrls = [];

    console.log("req.files", req.files); // Kiểm tra xem req.files có chứa tệp hay không

    // Kiểm tra và upload imgCertificatePractice
    if (req.files && req.files.imgCertificatePractice) {
      for (const file of req.files.imgCertificatePractice) {
        const resultCertificatePractice = await cloudinary.uploader.upload(
          file.path,
          {
            folder: "repairman_upgrade",
            transformation: [{ width: 500, height: 500, crop: "limit" }],
          }
        );
        imgCertificatePracticeUrls.push(resultCertificatePractice.secure_url); // Lưu URL vào mảng
      }
    }

    // Kiểm tra và upload imgCCCD
    if (req.files && req.files.imgCCCD) {
      for (const file of req.files.imgCCCD) {
        const resultCCCD = await cloudinary.uploader.upload(file.path, {
          folder: "repairman_upgrade",
          transformation: [{ width: 500, height: 500, crop: "limit" }],
        });
        imgCCCDUrls.push(resultCCCD.secure_url); // Lưu URL vào mảng
      }
    }

    // Update user's address
    await User.findByIdAndUpdate(userId, { address: address });

    const check = await RepairmanUpgradeRequest.findOne({
      user_id: userId
    })
    if (check) {
      return res.status(400).json({
        EC: 0,
        EM: "Bạn đã gửi yêu cầu nâng cấp trước đó vui lòng chờ phản hồi từ hệ thống!",
      });
    }
    // Create new Repairman Upgrade Request
    const newRequest = new RepairmanUpgradeRequest({
      user_id: userId,
      serviceIndustry_id: serviceIndustry._id, // Lấy _id của ServiceIndustry từ serviceType
      imgCertificatePractice: imgCertificatePracticeUrls,
      imgCCCD: imgCCCDUrls,
      description: description,
      status: "pending", // Default status: Pending
    });

    console.log("imgCertificatePracticeUrls", imgCertificatePracticeUrls);
    console.log("imgCCCDUrls", imgCCCDUrls);

    await newRequest.save();

    res.status(201).json({
      EC: 1,
      EM: "Yêu cầu nâng cấp lên thợ sửa chữa đã được gửi thành công! Vui lòng chờ Admin phê duyệt.",
    });
  } catch (err) {
    console.error("Repairman upgrade request error:", err);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
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
      EC: 1,
      EM: "Lấy danh sách VIP thành công!",
      DT: vips,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EC: 0,
      EM: "Lỗi server, vui lòng thử lại sau!",
    });
  }
};

const getStatusRepairman = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the repairman request by the user ID
    const repairmanRequest = await RepairmanUpgradeRequest.findOne({
      user_id: userId,
    });

    // If the repairman request does not exist
    if (!repairmanRequest) {
      return res
        .status(404)
        .json({ EC: 0, EM: "Không tìm thấy yêu cầu nâng cấp!" });
    }

    // Return the current status of the repairman request
    return res.status(200).json({
      EC: 1,
      EM: "Lấy trạng thái thợ thành công !",
      DT: repairmanRequest.status,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ EC: 0, EM: "Lỗi hệ thống, vui lòng thử lại!" });
  }
};

const toggleStatusRepairman = async (req, res) => {
  try {
    const userId = req.user.id;

    const repairmanRequest = await RepairmanUpgradeRequest.findOne({
      user_id: userId,
    });

    if (!repairmanRequest) {
      return res
        .status(404)
        .json({ EC: 0, EM: "Không tìm thấy yêu cầu nâng cấp!" });
    }

    if (repairmanRequest.status === "Active") {
      repairmanRequest.status = "Inactive";
    } else if (repairmanRequest.status === "Inactive") {
      repairmanRequest.status = "Active";
    } else {
      return res
        .status(400)
        .json({ EC: 0, EM: "Trạng thái không thể thay đổi!" });
    }

    await repairmanRequest.save();

    return res.status(200).json({
      EC: 1,
      EM: `Trạng thái đã cập nhật thành ${repairmanRequest.status}`,
      DT: repairmanRequest.status,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ EC: 0, EM: "Lỗi hệ thống, vui lòng thử lại!" });
  }
};
const dealPrice = async (req, res) => {
  try {
    const io = req.app.get('io'); // Lấy io từ app
    if (!io) {
      throw new Error('WebSocket IO instance not found');
    }

    const { requestId } = req.params;
    const { deal_price, isDeal } = req.body;
    const userId = req.user.id; // Lấy user ID của thợ sửa chữa từ token

    // Tìm RepairmanUpgradeRequest dựa trên user_id từ token
    const repairmanUpgradeRequest = await RepairmanUpgradeRequest.findOne({
      user_id: userId,
    });

    if (!repairmanUpgradeRequest) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy thông tin nâng cấp thợ sửa chữa cho người dùng này!"
      });
    }

    const repairmanId = repairmanUpgradeRequest._id;

    // Tìm Request có status 'Deal price' và được gán cho repairman này
    const dealPriceRequest = await Request.findOne({
      repairman_id: repairmanId,
      status: 'Deal price',
      parentRequest: requestId
    });

    if (!dealPriceRequest) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy yêu cầu deal giá nào cho thợ sửa chữa này!"
      });
    }

    const duePrice = await DuePrice.findOne({ request_id: dealPriceRequest._id });
    if (!duePrice) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy DuePrice cho yêu cầu deal giá này!"
      });
    }

    const duePrice_id = duePrice._id;

    if (isDeal === 'false') {
      // Xóa DuePrice và Request
      await DuePrice.findByIdAndDelete(duePrice_id);
      await Request.findByIdAndDelete(dealPriceRequest._id);

      // Gửi thông báo hủy deal (nếu cần) tới customer
      const parentRequest = await Request.findById(requestId);
      if (parentRequest && parentRequest.user_id) {
        const customerId = parentRequest.user_id.toString();
        console.log('Sending dealPriceCancel to customer:', customerId);
        io.to(customerId).emit('dealPriceCancel'); // Thêm sự kiện mới cho hủy deal
      }

      return res.status(200).json({
        EC: 1,
        EM: "Đã hủy bỏ deal giá và xóa yêu cầu thành công!",
        DT: {}
      });
    } else {
      if (!deal_price) {
        return res.status(400).json({
          EC: 0,
          EM: "Vui lòng cung cấp giá deal!"
        });
      }

      if (isNaN(deal_price)) {
        return res.status(400).json({
          EC: 0,
          EM: "Giá deal phải là một số!"
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
        priceToPay: parsedDealPrice
      });
      const savedPrice = await newPrice.save();

      dealPriceRequest.status = 'Done deal price';
      await dealPriceRequest.save();

      // Gửi thông báo tới khách hàng
      const parentRequest = await Request.findById(requestId);
      if (parentRequest && parentRequest.user_id) {
        const customerId = parentRequest.user_id.toString();
        console.log('Sending dealPriceUpdate to customer:', customerId);
        io.to(customerId).emit('dealPriceUpdate');
      }

      res.status(201).json({
        EC: 1,
        EM: "Deal giá thành công!"
      });
    }
  } catch (error) {
    console.error("Error in dealPrice API:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
    });
  }
};
// const viewRequest = async (req, res) => {
//     try {
//         const userId = req.user.id; // Lấy user ID của thợ sửa chữa từ token

//         // Tìm RepairmanUpgradeRequest dựa trên user_id từ token
//         const repairmanUpgradeRequest = await RepairmanUpgradeRequest.findOne({ user_id: userId });

//         if (!repairmanUpgradeRequest) {
//             return res.status(404).json({
//                 EC: 0,
//                 EM: "Không tìm thấy thông tin nâng cấp thợ sửa chữa cho người dùng này!"
//             });
//         }

//         // Sử dụng _id từ RepairmanUpgradeRequest làm repairmanId
//         const repairmanId = repairmanUpgradeRequest._id;

//         // Tìm Request có status 'Deal price' và được gán cho repairman này
//         const dealPriceRequest = await Request.findOne({
//             repairman_id: repairmanId,
//             status: 'Deal price' // Hoặc trạng thái phù hợp của bạn
//         }).sort({ createdAt: -1 }); // Lấy request mới nhất nếu có nhiều request
//         console.log(repairmanId);
//         if (!dealPriceRequest) {
//             return res.status(404).json({
//                 EC: 0,
//                 EM: "Không tìm thấy yêu cầu deal giá nào cho thợ sửa chữa này!"
//             });
//         }
//         res.status(201).json({
//             EC: 1,
//             EM: "Hiển thị đơn hàng thành công",
//             DT: dealPriceRequest
//         });
//     } catch (error) {

//     }
// }

const viewRequest = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy user ID của thợ sửa chữa từ token

    // Tìm RepairmanUpgradeRequest dựa trên user_id từ token
    const repairmanUpgradeRequest = await RepairmanUpgradeRequest.findOne({ user_id: userId });

    if (!repairmanUpgradeRequest) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy thông tin nâng cấp thợ sửa chữa cho người dùng này!"
      });
    }

    // Sử dụng _id từ RepairmanUpgradeRequest làm repairmanId
    const repairmanId = repairmanUpgradeRequest._id;

    // Tìm Request có status 'Deal price' và được gán cho repairman này
    const dealPriceRequest = await Request.findOne({
      repairman_id: repairmanId,
      status: { $in: ["Done deal price", "Deal price"] }, // Hoặc trạng thái phù hợp của bạn
    }).sort({ createdAt: -1 }); // Lấy request mới nhất nếu có nhiều request

    if (!dealPriceRequest) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy yêu cầu deal giá nào cho thợ sửa chữa này!"
      });
    }

    // Tìm DuePrice dựa trên request_id (là _id của dealPriceRequest)
    const duePrice = await DuePrice.findOne({ request_id: dealPriceRequest._id });

    // Nếu không tìm thấy DuePrice, có thể trả về giá trị mặc định hoặc thông báo lỗi
    if (!duePrice) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy thông tin giá đề xuất cho yêu cầu này!"
      });
    }

    // Thêm minPrice và maxPrice vào response
    res.status(201).json({
      EC: 1,
      EM: "Hiển thị đơn hàng thành công",
      DT: {
        ...dealPriceRequest._doc, // Lấy toàn bộ dữ liệu của dealPriceRequest
        minPrice: duePrice.minPrice, // Thêm minPrice từ DuePrice
        maxPrice: duePrice.maxPrice, // Thêm maxPrice từ DuePrice
      }
    });
  } catch (error) {
    res.status(500).json({
      EC: -1,
      EM: "Đã có lỗi xảy ra, vui lòng thử lại!",
      DT: error.message
    });
  }
};

const processMonthlyFee = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ EC: 1, EM: "Thiếu ID người dùng!" });
    }

    // Lấy thông tin user và ví
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ EC: 1, EM: "Không tìm thấy người dùng!" });
    }

    const wallet = await Wallet.findOne({ user_id: userId });
    if (!wallet) {
      return res.status(404).json({ EC: 1, EM: "Người dùng chưa có ví!" });
    }

    // Kiểm tra miễn phí tháng đầu tiên dựa vào ngày tạo tài khoản
    const currentDate = new Date();
    const userCreatedAt = new Date(user.createdAt);
    const isFirstMonthFree =
      currentDate.getMonth() === userCreatedAt.getMonth() &&
      currentDate.getFullYear() === userCreatedAt.getFullYear();

    if (isFirstMonthFree) {
      return res.status(200).json({
        EC: 0,
        EM: "Miễn phí tháng đầu tiên, không trừ phí!",
        DT: { balance: wallet.balance }
      });
    }

    // Kiểm tra xem đã thanh toán phí trong tháng này chưa
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const existingTransaction = await Transaction.findOne({
      wallet_id: wallet._id,
      transactionType: "payment",
      content: "Thanh toán phí thành viên hàng tháng",
      balanceAfterTransact: wallet.balance,
      createdAt: { $gte: startOfMonth }
    });

    if (existingTransaction) {
      return res.status(200).json({
        EC: 0,
        EM: "Bạn đã thanh toán phí tháng này rồi!",
        EX: "Dưới đây là lịch sử thanh toán tháng này",
        DT: { balance: wallet.balance, transaction: existingTransaction }
      });
    }

    // Kiểm tra số dư trong ví
    if (wallet.balance >= MONTHLY_FEE) {
      // Trừ tiền trong ví
      wallet.balance -= MONTHLY_FEE;
      await wallet.save();

      // Lưu lịch sử giao dịch
      const transaction = new Transaction({
        wallet_id: wallet._id,
        payCode: `VIPFEE-${Date.now()}`,
        amount: MONTHLY_FEE,
        status: 1,
        transactionType: "payment",
        content: "Thanh toán phí thành viên hàng tháng",
        balanceAfterTransact: wallet.balance
      });

      await transaction.save();

      // Gửi email xác nhận
      await sendEmail(user.email, "Thanh toán thành công",
        `<p>Chào ${user.firstName} ${user.lastName},</p>
              <p>Bạn đã thanh toán thành công phí tháng này với số tiền <strong>${MONTHLY_FEE} VND</strong>.</p>
              <p>Số dư còn lại trong ví: <strong>${wallet.balance} VND</strong>.</p>
              <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>`
      );

      return res.status(200).json({
        EC: 0,
        EM: "Thanh toán thành công!",
        DT: { balance: wallet.balance, transaction }
      });
    } else {
      // Gửi email thông báo trễ hạn
      await sendEmail(user.email, "Cảnh báo: Không đủ số dư thanh toán",
        `<p>Chào ${user.firstName} ${user.lastName},</p>
              <p>Bạn chưa thanh toán phí tháng này (<strong>${MONTHLY_FEE} VND</strong>) do số dư ví không đủ.</p>
              <p>Vui lòng nạp tiền vào ví để duy trì trạng thái của bạn.</p>`
      );

      return res.status(400).json({
        EC: 1,
        EM: "Số dư không đủ để thanh toán phí!",
        DT: { balance: wallet.balance }
      });
    }
  } catch (error) {
    console.error("Lỗi xử lý phí hàng tháng:", error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server, vui lòng thử lại sau!"
    });
  }
};
const registerVipPackage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { vip_id } = req.body; // Chỉ cần ID của gói VIP

    // Kiểm tra đầu vào
    if (!vip_id) {
      return res.status(400).json({
        EC: 0,
        EM: "Vui lòng cung cấp ID của gói VIP!",
      });
    }

    // Tìm thông tin nâng cấp thợ sửa chữa của người dùng
    const repairmanUpgradeRequest = await RepairmanUpgradeRequest.findOne({ user_id: userId });
    if (!repairmanUpgradeRequest) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy thông tin nâng cấp thợ sửa chữa cho người dùng này!",
      });
    }

    // Tìm gói VIP theo ID
    const vipPackage = await Vip.findById(vip_id);
    if (!vipPackage) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy gói VIP!",
      });
    }

    // Tìm ví của người dùng
    const wallet = await Wallet.findOne({ user_id: userId });
    if (!wallet) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy ví của thợ sửa chữa!",
      });
    }

    // Tính tổng chi phí (giá của gói VIP)
    const totalCost = vipPackage.price;

    // Kiểm tra số dư ví
    if (wallet.balance < totalCost) {
      return res.status(400).json({
        EC: 0,
        EM: "Số dư ví không đủ để thanh toán gói VIP!",
      });
    }

    // Trừ tiền từ số dư ví
    wallet.balance -= totalCost;
    await wallet.save();

    // Tạo mã giao dịch ngẫu nhiên
    const payCode = `VIP-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${Date.now()}`;

    // Lưu thông tin giao dịch
    const transaction = new Transaction({
      wallet_id: wallet._id,
      amount: totalCost,
      transactionType: "payment",
      content: `Thanh toán gói VIP: ${vipPackage.name}`,
      status: 1, // Thành công
      balanceAfterTransact: wallet.balance,
      payCode,
    });
    await transaction.save();

    // Cập nhật thông tin gói VIP
    repairmanUpgradeRequest.vip_id = vip_id;
    await repairmanUpgradeRequest.save();

    // Trả về phản hồi thành công
    return res.status(200).json({
      EC: 1,
      EM: "Đăng ký gói VIP thành công!",
      DT: {
        repairmanUpgradeRequest,
        wallet,
        transaction,
      },
    });
  } catch (error) {
    console.error("Error in registerVipPackage:", error);
    return res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
    });
  }
};

const addSecondCertificate = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the authenticated token
    const files = req.files;

    // Validate input
    if (!files || files.length === 0) {
      return res.status(400).json({
        EC: 0,
        EM: "Vui lòng cung cấp ít nhất một chứng chỉ bổ sung!",
      });
    }

    // Find the repairman upgrade request by user ID
    const repairmanRequest = await RepairmanUpgradeRequest.findOne({ user_id: userId });

    if (!repairmanRequest) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy yêu cầu nâng cấp thợ sửa chữa!",
      });
    }

    // Check if the status is "Active" or "Inactive"
    if (repairmanRequest.status !== "Active" && repairmanRequest.status !== "Inactive") {
      return res.status(400).json({
        EC: 0,
        EM: "Chỉ có thể yêu cầu bổ sung chứng chỉ khi không nhận đơn hàng nào!",
      });
    }

    // Ensure supplementaryPracticeCertificate is an array
    if (!Array.isArray(repairmanRequest.supplementaryPracticeCertificate)) {
      repairmanRequest.supplementaryPracticeCertificate = [];
    }

    if (repairmanRequest.supplementaryPracticeCertificate.length > 0) {
      return res.status(400).json({
        EC: 0,
        EM: "Bạn chỉ có thể thêm chứng chỉ bổ sung một lần!",
      });
    }

    // Extract file paths and update the supplementaryPracticeCertificate
    const filePaths = files.map(file => file.path);
    repairmanRequest.supplementaryPracticeCertificate.push(...filePaths);

    // Update the status in RepairmanUpgradeRequest
    repairmanRequest.status = "In review";

    // Save the updated request
    await repairmanRequest.save();

    res.status(200).json({
      EC: 1,
      EM: "Yêu cầu bổ sung chứng chỉ thành công!",
      DT: repairmanRequest,
    });
  } catch (error) {
    console.error("Error in addSecondCertificate:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
    });
  }
};
const viewCustomerRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const repairman = await RepairmanUpgradeRequest.findOne({ user_id: userId });

    const request = await Request.findOne({
      repairman_id: repairman._id,
      status: "Proceed with repair",
    })
      .populate('user_id', 'firstName lastName email phone imgAvt')
      .sort({ createdAt: -1 })
    res.status(200).json({
      EC: 1,
      EM: "Hiển thị thông tin khách hàng và đơn hàng thành công",
      DT: {
        request: request
      }
    })
  } catch (error) {
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
    });
  }
}
const confirmRequest = async (req, res) => {
  try {
    const io = req.app.get('io'); // Lấy io từ app
    if (!io) {
      throw new Error('WebSocket IO instance not found');
    }

    const userId = req.user.id;
    const { confirm } = req.body;

    // Tìm RepairmanUpgradeRequest
    const repairman = await RepairmanUpgradeRequest.findOne({ user_id: userId });
    if (!repairman) {
      return res.status(400).json({
        EC: 0,
        EM: "Không tìm thấy thông tin thợ sửa chữa"
      });
    }

    // Tìm Request
    const request = await Request.findOne({
      repairman_id: repairman._id,
      status: "Proceed with repair"
    })
      .populate({
        path: "user_id",
        populate: {
          path: "wallet"
        }
      })
      .populate("repairman_id")
      .populate("duePrices")
    const priceRequest = await Price.findOne({ duePrice_id: request.duePrices[0]._id })

    if (!request) {
      return res.status(400).json({
        EC: 0,
        EM: "Không tìm thấy đơn hàng sửa chữa"
      });
    }

    if (confirm === "Completed") {
      // Cập nhật trạng thái
      repairman.status = 'Active';
      await repairman.save();

      request.status = 'Repairman confirmed completion';
      await request.save();

      // Gửi thông báo WebSocket tới khách hàng (dựa trên user_id của customer)
      const customerId = request.user_id.toString(); // Giả sử request có field user_id là ID của khách hàng
      console.log('Sending repairmanConfirmedCompletion to customer:', customerId);
      io.to(customerId).emit('repairmanConfirmedCompletion', { requestId: request._id }); // Gửi thêm requestId để frontend dễ xử lý

      res.status(201).json({
        EC: 1,
        EM: 'Xác nhận hoàn thành đơn hàng thành công, vui lòng đợi khách hàng xác nhận để nhận tiền',
        DT: request.status
      });
    } else if (confirm === "Customer not responding") {
      const walletRepairman = await Wallet.findOne({ user_id: userId });
      repairman.status = "Active";
      await repairman.save();

      request.status = "Customer not responding";
      await request.save();

      request.user_id.wallet.balance = + priceRequest.priceToPay * 0.9// ví khách hàng
      await request.user_id.wallet.save();

      walletRepairman.balance = priceRequest.priceToPay * 0.1 // ví thợ
      await walletRepairman.save();
      // Gửi email xác nhận cho khách hàng
      await sendEmail(request.user_id.email, "Đơn hàng bị hủy bỏ",
        `<p>Chào ${request.user_id.firstName} ${request.user_id.lastName},</p>
              <p>Thợ chúng tôi đã cố gắng liên lạc nhưng không nhận được phản hồi từ bạn</strong>.</p>
              <p>Chúng tôi đã hoàn số tiền <strong>${priceRequest.priceToPay} VND về ví của bạn trong đó có trừ 10% chi phí tổng đơn hàng</strong>.</p>
              <p>Số dư còn lại trong ví: <strong>${request.user_id.wallet.balance} VND</strong>.</p>
              <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>`
      );
      res.status(201).json({
        EC: 1,
        EM: 'Bạn sẽ được hưởng 10% tiền đơn hàng do lỗi khách hàng',
        DT: request.status
      });
    } else {
      return res.status(400).json({
        EC: 0,
        EM: "Giá trị xác nhận không hợp lệ"
      });
    }

  } catch (error) {
    console.error("Error in confirmRequest API:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
    });
  }
};

const getRepairmanRevenueByTime = async (req, res) => {
  try {
    const { time = "month" } = req.query;
    const userId = req.user.id;

    if (time !== "month" && time !== "year") {
      return res.status(400).json({
        EC: 0,
        EM: "Giá trị 'time' không hợp lệ. Chỉ cho phép 'month' hoặc 'year'."
      });
    }

    const repairman = await RepairmanUpgradeRequest.findOne({ user_id: userId });
    if (!repairman) {
      return res.status(400).json({
        EC: 0,
        EM: "Không tìm thấy thông tin thợ sửa chữa"
      });
    }

    const wallet = await Wallet.findOne({ user_id: userId });
    if (!wallet) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy ví của người dùng."
      });
    }

    const matchStage = {
      wallet_id: wallet._id,
      status: 1,
      transactionType: "payment"
    };

    let groupStage, projectStage, sortStage;
    if (time === "year") {
      groupStage = {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        totalRevenue: { $sum: "$amount" }
      };
      projectStage = {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalRevenue: 1
      };
      sortStage = { "_id.year": 1, "_id.month": 1 };
    } else {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      groupStage = {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        },
        totalRevenue: { $sum: "$amount" }
      };
      projectStage = {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        day: "$_id.day",
        totalRevenue: 1
      };
      sortStage = { "_id.year": 1, "_id.month": 1, "_id.day": 1 };
    }

    const rawResult = await Transaction.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: sortStage },
      { $project: projectStage }
    ]);

    const filledResult = [];
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // format lại data hiển thị
    if (time === "year") {
      const yearMap = new Map(); // dùng Map để để performance nhanh hơn
      for (const r of rawResult) {
        const key = `${r.year}`;
        if (!yearMap.has(key)) yearMap.set(key, {});
        yearMap.get(key)[r.month] = r.totalRevenue;
      }

      yearMap.forEach((months, year) => {
        for (let i = 1; i <= 12; i++) {
          filledResult.push({
            year: parseInt(year),
            month: i,
            totalRevenue: months[i] || 0
          });
        }
      });
    } else {
      const targetMonth = parseInt(req.query.month) || currentMonth;
      const targetYear = parseInt(req.query.year) || currentYear;
      const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();

      const dayMap = new Map();
      for (const r of rawResult) {
        if (r.year === targetYear && r.month === targetMonth) {
          dayMap.set(r.day, r.totalRevenue);
        }
      }

      for (let day = 1; day <= daysInMonth; day++) {
        filledResult.push({
          year: targetYear,
          month: targetMonth,
          day,
          totalRevenue: dayMap.get(day) || 0
        });
      }
    }

    return res.status(200).json({
      EC: 1,
      EM: `Thống kê doanh thu theo ${time === "year" ? "năm" : "tháng"} thành công!`,
      DT: filledResult
    });
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu:", error);
    return res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
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
    const daysInMonth = new Date(year, month, 0).getDate();

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
          _id: {
            day: { $dayOfMonth: "$updatedAt" },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.day": 1 },
      },
    ]);

    // Tạo mảng kết quả chi tiết cho từng ngày
    const detailedResult = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = { day, Completed: 0, Cancelled: 0 };
      results.forEach((item) => {
        if (item._id.day === day) {
          dayData[item._id.status] = item.count;
        }
      });
      detailedResult.push(dayData);
    }

    return res.status(200).json({
      EC: 1,
      EM: "Thống kê theo tháng thành công!",
      DT: detailedResult,
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
          _id: {
            month: { $month: "$updatedAt" },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ]);

    // Tạo mảng kết quả chi tiết cho từng tháng
    const detailedResult = [];
    for (let month = 1; month <= 12; month++) {
      const monthData = { month, Completed: 0, Cancelled: 0 };
      results.forEach((item) => {
        if (item._id.month === month) {
          monthData[item._id.status] = item.count;
        }
      });
      detailedResult.push(monthData);
    }

    return res.status(200).json({
      EC: 1,
      EM: "Thống kê theo năm thành công!",
      DT: detailedResult,
    });
  } catch (error) {
    console.error("Lỗi khi thống kê theo năm:", error);
    return res.status(500).json({
      EC: 0,
      EM: "Đã xảy ra lỗi. Vui lòng thử lại!",
    });
  }
};

const getAllRepairmanStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const repairman = await RepairmanUpgradeRequest.findOne({ user_id: userId });
    if (!repairman) {
      return res.status(400).json({
        EC: 0,
        EM: "Không tìm thấy thông tin thợ sửa chữa",
      });
    }

    const wallet = await Wallet.findOne({ user_id: userId });
    if (!wallet) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy ví của người dùng.",
      });
    }

    const prefixes = ["REC-SEV", "VIPFEE", "VIP"];
    const matchCondition = {
      wallet_id: wallet._id,
      status: 1,
      $or: prefixes.map(prefix => ({ payCode: { $regex: `^${prefix}` } })),
    };

    // Lấy doanh thu chi tiết theo ngày
    const revenueByDay = await Transaction.aggregate([
      { $match: matchCondition },
      {
        $project: {
          payCode: 1,
          amount: 1,
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
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
            day: "$day",
            prefix: "$prefix",
          },
          totalAmount: { $sum: "$adjustedAmount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    // Lấy toàn bộ trạng thái đơn hàng
    const requests = await Request.aggregate([
      { $match: { status: { $in: ["Completed", "Cancelled"] } } },
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" },
            day: { $dayOfMonth: "$updatedAt" },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Tổ chức dữ liệu theo năm
    const statsByYear = {};
    revenueByDay.forEach((item) => {
      const { year, month, day, prefix } = item._id;
      const amount = item.totalAmount;
      if (!statsByYear[year]) statsByYear[year] = {};
      if (!statsByYear[year][month]) statsByYear[year][month] = { revenue: [], requests: [] };
      let dayData = statsByYear[year][month].revenue.find((d) => d.day === day);
      if (!dayData) {
        dayData = { day, registrationFee: 0, commissionFee: 0, vipFee: 0 };
        statsByYear[year][month].revenue.push(dayData);
      }
      if (prefix === "VIPFEE") dayData.registrationFee = amount;
      else if (prefix === "REC-SEV") dayData.commissionFee = amount;
      else if (prefix === "VIP") dayData.vipFee = amount;
    });

    requests.forEach((item) => {
      const { year, month, day, status } = item._id;
      const count = item.count;
      if (!statsByYear[year]) statsByYear[year] = {};
      if (!statsByYear[year][month]) statsByYear[year][month] = { revenue: [], requests: [] };
      const monthData = statsByYear[year][month].requests;
      let dayData = monthData.find((d) => d.day === day);
      if (!dayData) {
        dayData = { day, Completed: 0, Cancelled: 0 };
        monthData.push(dayData);
      }
      if (status === "Completed") dayData.Completed = count;
      else if (status === "Cancelled") dayData.Cancelled = count;
    });

    return res.status(200).json({
      EC: 1,
      EM: "Lấy toàn bộ thống kê thành công!",
      DT: statsByYear,
    });
  } catch (error) {
    console.error("Lỗi khi lấy toàn bộ thống kê:", error);
    return res.status(500).json({
      EC: 0,
      EM: "Đã xảy ra lỗi. Vui lòng thử lại!",
    });
  }
};

module.exports = {
  getAllRepairmanStats,
  requestRepairmanUpgrade,
  getAllVips,
  getTypeServiceIndustry,
  toggleStatusRepairman,
  getStatusRepairman,
  dealPrice,
  processMonthlyFee,
  viewRequest,
  registerVipPackage,
  addSecondCertificate,
  viewCustomerRequest,
  confirmRequest,
  getRepairmanRevenueByTime,
  getRequestStatusByMonth,
  getRequestStatusByYear,
};
