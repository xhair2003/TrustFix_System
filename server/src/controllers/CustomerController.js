const {
  User,
  Role,
  Wallet,
  Transaction,
  Complaint,
  Request,
  Rating,
  DuePrice,
  Price,
  ServiceIndustry,
  RepairmanUpgradeRequest,
} = require("../models");
const cloudinary = require("../../config/cloudinary");
const fetch = require("node-fetch");
const user = require("../models/user");
const { sendEmail } = require("../constants");


const getBalance = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy user ID từ token đã xác thực

    // Tìm wallet dựa trên user_id
    const wallet = await Wallet.findOne({ user_id: userId });

    if (!wallet) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy ví cho người dùng này!",
        balance: 0,
      });
    }

    return res.status(200).json({
      EC: 1,
      EM: "Lấy số dư thành công!",
      DT: wallet.balance, // Trả về số dư
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EC: 0,
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
        EM: "Không tìm thấy ví của người dùng!",
      });
    }

    // Find all transactions for the user's wallet with transactionType as 'deposite'
    const transactions = await Transaction.find({
      wallet_id: wallet._id,
      transactionType: "payment",
    })
      .populate({
        path: "wallet_id",
        populate: { path: "user_id", select: "firstName lastName email" }, // Populate user info in wallet
      })
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order ( mới nhất trước)

    res.status(200).json({
      EC: 1,
      EM: "Lấy lịch sử giao dịch thành công!",
      DT: transactions,
    });
  } catch (error) {
    console.error("Error getting user transaction history:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
    });
  }
};

const getAllDepositeHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from verified token

    // Find the user's wallet
    const wallet = await Wallet.findOne({ user_id: userId });
    if (!wallet) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy ví của người dùng!",
      });
    }

    // Find all transactions for the user's wallet with transactionType as 'deposite'
    const transactions = await Transaction.find({
      wallet_id: wallet._id,
      transactionType: "deposite",
    })
      .populate({
        path: "wallet_id",
        populate: { path: "user_id", select: "firstName lastName email" }, // Populate user info in wallet
      })
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order ( mới nhất trước)

    res.status(200).json({
      EC: 1,
      EM: "Lấy lịch sử giao dịch thành công!",
      DT: transactions,
    });
  } catch (error) {
    console.error("Error getting user transaction history:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
    });
  }
};

const createComplaint = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy user ID từ token
    const { request_id, complaintContent, complaintType, requestResolution } =
      req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !request_id ||
      !complaintContent ||
      !complaintType ||
      !requestResolution
    ) {
      return res.status(400).json({
        EC: 0,
        EM: "Vui lòng nhập đầy đủ mã yêu cầu, nội dung, loại khiếu nại và yêu cầu giải quyết!",
      });
    }

    // Kiểm tra mã yêu cầu
    const request = await Request.findOne({ _id: request_id, user_id: userId });
    if (!request) {
      return res.status(400).json({
        EC: 0,
        EM: "Mã yêu cầu không hợp lệ hoặc không thuộc về người dùng này.",
      });
    }

    // Upload ảnh mới nếu có
    let image = null; // Mặc định không có ảnh
    console.log(req.file); // Kiểm tra xem file có được upload không
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "complaint_images", // Upload vào thư mục complaint_images
        transformation: [{ width: 500, height: 500, crop: "limit" }],
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
      DT: newComplaint,
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra khi gửi khiếu nại. Vui lòng thử lại sau!",
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
        EM: "Người dùng không tồn tại trong hệ thống!",
      });
    }

    // Lấy tất cả các yêu cầu của người dùng
    const requests = await Request.find({ user_id: userId })
      .populate("user", "firstName lastName email phone")
      .populate("serviceIndustry", "name description")
      .populate("ratings", "rating comment")
      .populate("images", "url")
      .populate("repairman", "name");

    res.status(200).json({
      EC: 1,
      EM: "Lấy thông tin tất cả yêu cầu thành công!",
      DT: requests,
    });
  } catch (err) {
    console.error("Get all requests error:", err);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
    });
  }
};
const getRatingById = async (req, res) => {
  try {
    const userId = req.params.userId;

    const ratings = await Rating.find({ user_id: userId })
      .populate({
        path: "userRole",
        match: { name: "repairman" }, // Chỉ lấy những người dùng có vai trò là repairman
        select: "firstName lastName email",
      })
      .populate("request", "description status");

    res.status(200).json({
      EC: 1,
      EM: "Lấy thông tin đánh giá của người dùng thành công!",
      DT: ratings,
    });
  } catch (err) {
    console.error("Get ratings by user ID error:", err);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
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
        EM: "Vui lòng nhập đánh giá từ 1-5!",
      });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        EC: 0,
        EM: "Vui lòng nhập bình luận!",
      });
    }

    // Kiểm tra xem người dùng đã đánh giá yêu cầu này chưa
    const existingRating = await Rating.findOne({ request_id, user_id });
    if (existingRating) {
      return res.status(400).json({
        EC: 0,
        EM: "Bạn đã đánh giá một lần rồi!",
      });
    }

    const newRating = new Rating({
      request_id,
      user_id,
      rate,
      comment,
    });

    const savedRating = await newRating.save();

    console.log("Rating saved:", savedRating);
    console.log("Rating by:", user_email);

    res.status(201).json({
      EC: 1,
      EM: "Đánh giá thành công!",
      DT: savedRating,
    });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra khi thêm đánh giá. Vui lòng thử lại sau!",
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
        EM: "Vui lòng nhập bình luận!",
      });
    }
    const rating = await Rating.findByIdAndUpdate(
      rating_id,
      { comment },
      { new: true }
    );
    console.log("Rating edited :", rating);
    console.log("Edit by :", user_email);

    res.status(200).json({
      EC: 1,
      EM: "Cập nhật đánh giá thành công!",
      DT: rating,
    });
  } catch (error) {
    console.log("Error editing rating:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra khi cập nhật đánh giá. Vui lòng thử lại sau!",
    });
  }
};
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
      EM: "Đã có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại sau!",
    });
  }
};

const updateInformation = async (req, res) => {
  try {
    const { email, firstName, lastName, phone, address, description } =
      req.body;
    const userId = req.user.id;

    // Tìm user theo userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        EC: 0,
        EM: "Người dùng không tồn tại trong hệ thống!",
      });
    }

    // Upload ảnh mới nếu có
    let imgAvt = user.imgAvt; // Mặc định giữ ảnh cũ
    console.log(req.file);
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_avatars", // Upload vào thư mục user_avatars
        transformation: [{ width: 500, height: 500, crop: "limit" }],
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
      DT: userResponse,
    });
  } catch (err) {
    console.error("Update information error:", err);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
    });
  }
};

const findNearbyRepairmen = async (req, res) => {
  try {
    const { address, radius } = req.body;
    //const gomapApiKey = "AlzaSyhy1S40EaAbIPht2S-okkBnsuuhmpr5VOo";

    if (!address || !radius) {
      return res.status(400).json({
        EC: 0,
        EM: "Vui lòng cung cấp địa chỉ và bán kính tìm kiếm!",
      });
    }

    const searchRadius = parseFloat(radius);
    if (isNaN(searchRadius) || searchRadius <= 0) {
      return res.status(400).json({
        EC: 0,
        EM: "Bán kính tìm kiếm không hợp lệ!",
      });
    }

    const repairmanRole = await Role.findOne({ type: "repairman" });
    if (!repairmanRole) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy vai trò thợ sửa chữa!",
      });
    }
    const repairmenUsers = await User.find({
      _id: { $in: await Role.find({ type: "repairman" }).distinct("user_id") },
    });

    if (!repairmenUsers || repairmenUsers.length === 0) {
      return res.status(200).json({
        EC: 1,
        EM: "Không tìm thấy thợ sửa chữa nào!",
        DT: [],
      });
    }

    const nearbyRepairmen = [];

    for (const repairman of repairmenUsers) {
      if (repairman.address) {
        const gomapApiUrl = `https://maps.gomaps.pro/maps/api/distancematrix/json?destinations=${encodeURIComponent(
          repairman.address
        )}&origins=${encodeURIComponent(address)}&key=${process.env.GOMAPS_API_KEY
          }`;

        try {
          const gomapResponse = await fetch(gomapApiUrl);
          const gomapData = await gomapResponse.json();

          if (
            gomapData.status === "OK" &&
            gomapData.rows[0].elements[0].status === "OK"
          ) {
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
                duration: gomapData.rows[0].elements[0].duration.text,
              });
            }
          } else {
            console.warn(
              `GoMap API error for repairman ${repairman._id}: ${gomapData.status
              } - ${gomapData.error_message || gomapData.rows[0].elements[0].status
              }`
            );
          }
        } catch (error) {
          console.error(
            `Error calling GoMap API for repairman ${repairman._id}:`,
            error
          );
        }
      }
    }

    res.status(200).json({
      EC: 1,
      EM: "Tìm kiếm thợ sửa chữa gần đây thành công!",
      DT: nearbyRepairmen,
    });
  } catch (error) {
    console.error("Error finding nearby repairmen:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
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
        balance, // Thêm thông tin số dư
      },
    });
  } catch (error) {
    res.status(500).json({
      EC: 0,
      EM: "Có lỗi xảy ra khi lấy thông tin người dùng",
    });
  }
};
const sendRequest = async (req, res, next) => {
  try {
    const { serviceIndustry_id, description, address, radius } = req.body; // Lấy 'price' từ req.body
    //console.log("serviceIndustry_id", serviceIndustry_id);
    //console.log("description", description);
    //console.log("address", address);
    //console.log("radius", radius);
    //const gomapApiKey = process.env.GOMAPS_API_KEY;
    const userId = req.user.id; // Lấy user ID từ token

    // Validate các trường bắt buộc
    if (!serviceIndustry_id || !description || !address || !radius) {
      // Thêm 'price' vào validation
      return res.status(400).json({
        EC: 0,
        EM: "Vui lòng cung cấp đầy đủ loại dịch vụ, mô tả, địa chỉ, bán kính!", // Cập nhật thông báo lỗi
      });
    }

    // const searchRadius = parseFloat(radius);
    // if (isNaN(searchRadius) || searchRadius <= 0) {
    //     return res.status(400).json({
    //         EC: 0,
    //         EM: "Bán kính tìm kiếm không hợp lệ!"
    //     });
    // }

    const serviceIndustry = await ServiceIndustry.findById(serviceIndustry_id);
    if (!serviceIndustry) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy loại hình dịch vụ!",
      });
    }

    // Upload ảnh mới nếu có - Tương tự như createComplaint
    // let image = null; // Mặc định không có ảnh
    // console.log(req.file); // Kiểm tra xem file có được upload không
    // if (req.file) {
    //   const result = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "request_images", // Upload vào thư mục request_images - thư mục khác với complaint
    //     transformation: [{ width: 500, height: 500, crop: "limit" }],
    //   });
    //   image = result.secure_url; // Lấy link ảnh từ Cloudinary
    // }

    let image = [];
    if (req.files) { // req.files sẽ là mảng các file
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "request_images",
          transformation: [{ width: 500, height: 500, crop: "limit" }]
        });
        image.push(result.secure_url);
      }
    }

    //console.log("image", image);

    // Tạo Request mới
    const newRequest = new Request({
      user_id: userId,
      serviceIndustry_id: serviceIndustry_id,
      description: description,
      address: address,
      image: image.length ? image : [], // Lưu mảng URL hoặc mảng rỗng
      status: "Requesting Details", // Trạng thái mặc định
    });
    const savedRequest = await newRequest.save();
    req.savedRequest = { requestId: savedRequest._id };

    next();
  } catch (error) {
    console.error("Error creating service request:", error); // Cập nhật log error message
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
    });
  }
};

const findRepairman = async (req, res) => {
  try {
    const io = req.app.get('io'); // Lấy io từ app (sẽ cấu hình trong index.js)
    const requestId = req.savedRequest.requestId;
    const { radius, minPrice, maxPrice } = req.body; // Get radius from request parameters
    const gomapApiKey = process.env.GOMAPS_API_KEY;

    if (!requestId || !minPrice || !maxPrice) {
      return res.status(400).json({
        EC: 0,
        EM: "Vui lòng cung cấp ID yêu cầu dịch vụ",
      });
    }
    if (!radius) {
      return res.status(400).json({
        EC: 0,
        EM: "Vui lòng cung cấp bán kính tìm kiếm!",
      });
    }

    const originalRequest = await Request.findById(requestId); // Rename to originalRequest
    if (!originalRequest) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy yêu cầu dịch vụ!",
      });
    }

    // Cập nhật trạng thái Request gốc thành 'Pending'
    originalRequest.status = "Pending"; // Update originalRequest status
    await originalRequest.save();

    const { address } = originalRequest; // Get address from originalRequest

    // Tìm kiếm thợ sửa chữa gần đây (logic cũ)
    const repairmanRole = await Role.findOne({ type: "repairman" });
    if (!repairmanRole) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy vai trò thợ sửa chữa!",
      });
    }
    const repairmanUpgradeRequests = await RepairmanUpgradeRequest.find({
      status: "Active",
      serviceIndustry_id: originalRequest.serviceIndustry_id,
    });
    const repairmanUserIds = repairmanUpgradeRequests.map(
      (request) => request.user_id
    );

    const repairmenUsers = await User.find({
      _id: { $in: repairmanUserIds },
    });

    if (!repairmenUsers || repairmenUsers.length === 0) {
      await Request.deleteOne({ _id: originalRequest._id }); // <--- CÁCH PHỔ BIẾN VÀ RÕ RÀNG HƠN
      return res.status(400).json({
        EC: 0,
        EM: `Không tìm thấy thợ sửa chữa nào trong khu vực bán kính ${radius}km!`,

      });
    }

    const nearbyRepairmen = [];

    for (const repairman of repairmenUsers) {
      if (repairman.address) {
        const gomapApiUrl = `https://maps.gomaps.pro/maps/api/distancematrix/json?destinations=${encodeURIComponent(
          repairman.address
        )}&origins=${encodeURIComponent(address)}&key=${gomapApiKey}`;

        try {
          const gomapResponse = await fetch(gomapApiUrl);
          const gomapData = await gomapResponse.json();

          if (
            gomapData.status === "OK" &&
            gomapData.rows[0].elements[0].status === "OK"
          ) {
            const distanceValue = gomapData.rows[0].elements[0].distance.value;

            if (distanceValue <= radius * 1000) {
              nearbyRepairmen.push({
                _id: repairman._id,
                firstName: repairman.firstName,
                lastName: repairman.lastName,
                email: repairman.email,
                phone: repairman.phone,
                address: repairman.address,
                distance: gomapData.rows[0].elements[0].distance.text,
                duration: gomapData.rows[0].elements[0].duration.text,
              });
            }
          } else {
            console.warn(
              `GoMap API error for repairman ${repairman._id}: ${gomapData.status
              } - ${gomapData.error_message || gomapData.rows[0].elements[0].status
              }`
            );
          }
        } catch (error) {
          console.error(
            `Error calling GoMap API for repairman ${repairman._id}:`,
            error
          );
        }
      }
    }

    let assignedRepairman = null;
    const newRequestsForRepairmen = []; // Change to array to store multiple requests
    const newDuePricesForRepairmen = [];
    if (nearbyRepairmen.length > 0) {
      for (const repairman of nearbyRepairmen) {
        // Loop through all nearby repairmen
        // Tìm RepairmanUpgradeRequest tương ứng với user_id của repairman
        const repairmanUpgradeRequest = await RepairmanUpgradeRequest.findOne({
          user_id: repairman._id,
        });

        let repairmanUpgradeRequestId = null;
        if (repairmanUpgradeRequest) {
          repairmanUpgradeRequestId = repairmanUpgradeRequest._id;
        } else {
          console.warn(
            `Không tìm thấy RepairmanUpgradeRequest cho user_id: ${repairman._id}`
          );
          continue; // Skip repairman này nếu không tìm thấy RepairmanUpgradeRequest
        }

        // Tạo một bản ghi Request mới cho mỗi thợ
        const newRequestForRepairman = new Request({
          user_id: originalRequest.user_id, // User ID giống request gốc
          serviceIndustry_id: originalRequest.serviceIndustry_id, // ServiceIndustry ID giống request gốc
          description: originalRequest.description, // Mô tả giống request gốc
          address: originalRequest.address, // Địa chỉ giống request gốc
          image: originalRequest.image, // Image giống request gốc
          status: "Deal price", // Trạng thái mới là 'Deal price'
          repairman_id: repairmanUpgradeRequestId, // Sử dụng repairmanUpgradeRequestId ở đây
          parentRequest: originalRequest._id, // Liên kết với request gốc qua parentRequest
        });
        await newRequestForRepairman.save(); // Lưu request mới
        newRequestsForRepairmen.push(newRequestForRepairman); // Add new request to the array
        //DuePrice cho mooix thowj
        const newDuePriceForRepairmen = new DuePrice({
          request_id: newRequestForRepairman._id,
          minPrice: minPrice,
          maxPrice: maxPrice,
        });
        await newDuePriceForRepairmen.save();
        newDuePricesForRepairmen.push(newDuePriceForRepairmen);
        // Update RepairmanUpgradeRequest status to 'Deal price'
        const repairmanUpgrade = await RepairmanUpgradeRequest.findOne({
          user_id: repairman._id,
        });
        if (repairmanUpgrade) {
          repairmanUpgrade.status = "Deal price";
          await repairmanUpgrade.save();
        }

        if (!assignedRepairman) {
          assignedRepairman = repairman; // Assign the first repairman as assignedRepairman for response
        }

        // Gửi thông báo WebSocket tới thợ (không gửi dữ liệu chi tiết)
        console.log('Sending newRequest to repairman:', repairman._id.toString());
        io.to(repairman._id.toString()).emit('newRequest');
      }
    }
    const newDuePrice = new DuePrice({
      request_id: requestId, // Liên kết với request_id
      minPrice: minPrice,
      maxPrice: maxPrice,
    });
    await newDuePrice.save(); // Lưu Due_price
    //const deal_price = minPrice + "  " + maxPrice;

    res.status(200).json({
      EC: 1,
      EM: "Gửi yêu cầu tìm kiếm thành công!",
      // DT: {
      //   //nearbyRepairmen: nearbyRepairmen,
      //   request: originalRequest, // Vẫn trả về request gốc
      //   //assignedRepairman: assignedRepairman, // Vẫn trả về assignedRepairman (first one found)
      //   deal_price: saveDuePrice,
      //   // newRequestsForRepairmen: newRequestsForRepairmen // Trả về array các request mới tạo
      // },
      DT: originalRequest._id, // Trả về ID của request gốc
    });
  } catch (error) {
    console.error("Error finding repairman and assigning:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
    });
  }
};

const viewRepairHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the token

    // Fetch all requests for the user
    const requests = await Request.find({ user_id: userId }).populate({
      path: "serviceIndustry_id", // Populate the serviceIndustry_id field
      select: "type", // Select only the type field from ServiceIndustry
    });

    // Check if requests exist
    if (!requests || requests.length === 0) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy lịch sử sửa chữa cho người dùng này.",
      });
    }

    // Map through requests to include service type
    const repairHistory = requests.map((request) => ({
      ...request.toObject(), // Convert Mongoose document to plain object
      serviceType: request.serviceIndustry_id
        ? request.serviceIndustry_id.type
        : null, // Add service type
    }));

    res.status(200).json({
      EC: 1,
      EM: "Lấy lịch sử sửa chữa thành công!",
      DT: repairHistory,
    });
  } catch (error) {
    console.error("Error fetching repair history:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra khi lấy lịch sử sửa chữa. Vui lòng thử lại sau!",
    });
  }
};
const viewRepairmanDeal = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const requests = await Request.find({
      user_id: userId,
      repairman_id: { $ne: null },
      parentRequest: requestId,
      status: 'Done deal price'
    });

    if (!requests || requests.length === 0) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy yêu cầu deal giá phù hợp!"
      });
    }

    const repairmanDeals = [];

    for (const request of requests) {
      const repairmanInfor = await RepairmanUpgradeRequest.findById(request.repairman_id)
        .select('_id')
        .populate('user_id', 'firstName lastName imgAvt address description')
      //const repairmanInfor = await User.findById(repairman.user_id).select('firstName lastName email phone imgAvt address description repairman._id');

      // Lấy certificationImage từ RepairmanUpgradeRequest dựa trên user_id
      const repairmanUpgrade = await RepairmanUpgradeRequest.findOne({ user_id: repairmanInfor._id });
      const certificationImages = repairmanUpgrade ? repairmanUpgrade.imgCertificatePractice : []; // Giả định certificationImage là mảng

      // Lấy số lần được booking thành công của thợ
      const bookingCounts = await Request.find({ repairman_id: repairmanInfor._id, status: 'Completed' });
      const bookingCount = bookingCounts ? bookingCounts.length : 0;

      // Thêm certificationImages vào repairmanInfor
      repairmanInfor._doc.certificationImages = certificationImages; // Thêm vào _doc để có thể sửa đổi

      // Thêm bookingCount vào repairmanInfor
      repairmanInfor._doc.bookingCount = bookingCount; // Thêm vào _doc để có thể sửa đổi

      const completedRequests = await Request.find({
        repairman_id: request.repairman_id,
        status: 'Completed'
      });
      const completedRequestIds = completedRequests.map(req => req._id);
      const repairmanRatings = await Rating.find({
        request_id: { $in: completedRequestIds }
      }).populate('request_id', 'description status');

      const duePrice = await DuePrice.findOne({ request_id: request._id });
      let dealPriceInfo = null;
      if (duePrice) {
        dealPriceInfo = await Price.findOne({ duePrice_id: duePrice._id });
      }

      repairmanDeals.push({
        request: request,
        repairman: repairmanInfor,
        ratings: repairmanRatings,
        dealPrice: dealPriceInfo
      });
    }

    res.status(201).json({
      EC: 1,
      EM: "Hiển thị danh sách thợ đã deal giá cho đơn hàng sửa chữa đã tạo kèm mức giá deal thành công!",
      DT: repairmanDeals
    });
  } catch (error) {
    console.error("Error in dealPrice API:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
    });
  }
};
const assignedRepairman = async (req, res) => {
  try {
    const io = req.app.get('io'); // Lấy io từ app (sẽ cấu hình trong index.js)
    const userId = req.user.id; // Customer ID from token
    const { repairmanId, requestId } = req.params;
    //const { requestId } = req.body;
    const repairmanDeals = req.repairmanDeals;

    if (!repairmanId) {
      return res.status(400).json({
        EC: 0,
        EM: "Vui lòng cung cấp ID thợ sửa chữa!"
      });
    }

    const selectedRepairmanDeal = repairmanDeals.find(deal => deal.request.repairman_id.toString() === repairmanId);

    if (!selectedRepairmanDeal) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy thông tin deal giá cho thợ sửa chữa này!",
        repairmanDeals
      });
    }
    const repairmanInfor = selectedRepairmanDeal.repairman;
    const dealPriceInfo = selectedRepairmanDeal.dealPrice;


    // Find the specific request for deal price and ensure it belongs to the customer
    const requestDeal = await Request.findOne({
      user_id: userId,
      repairman_id: repairmanId,
      parentRequest: requestId,
      status: 'Done deal price' // Ensure request is in 'Deal price' status
    })

    if (!requestDeal) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy yêu cầu deal giá phù hợp hoặc yêu cầu không hợp lệ!",

      });
    }

    // Get deal price from Price table via dealPriceInfo
    const dealPriceValue = dealPriceInfo.priceToPay


    // Get customer wallet
    const customerWallet = await Wallet.findOne({ user_id: userId });
    if (!customerWallet) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy ví của bạn!",
      });
    }

    // Check if customer has enough balance
    if (customerWallet.balance < dealPriceValue) {
      return res.status(400).json({
        EC: 0,
        EM: "Số dư trong ví không đủ để thanh toán, vui lòng nạp thêm tiền vào ví!",
      });
    }

    // Get repairman wallet - Assuming repairman's user_id is in RepairmanUpgradeRequest
    const repairmanUpgradeRequest = await RepairmanUpgradeRequest.findOne({
      user_id: repairmanInfor._id,
    })
    if (!repairmanUpgradeRequest || !repairmanUpgradeRequest.user_id) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy thông tin thợ sửa chữa!"
      });
    }
    const repairmanWallet = await Wallet.findOne({ user_id: repairmanInfor._id });
    if (!repairmanWallet) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy ví của thợ sửa chữa!"
      });
    }


    // Start transaction - For atomicity (optional, can be added for more robust payment processing)
    // const session = await mongoose.startSession();
    // session.startTransaction();
    //request gốc
    const requestParent = await Request.findById(requestId);
    //request con
    const requestChild = await Request.find({
      parentRequest: requestId,
    });
    const Due_Price = await DuePrice.findOne({
      request_id: requestId,
    })
    try {
      // Deduct from customer wallet
      customerWallet.balance -= dealPriceValue;
      await customerWallet.save();

      // // Credit to repairman wallet
      // repairmanWallet.balance += dealPriceValue;
      // await repairmanWallet.save();


      // Update request status to 'Assigned' and set repairman_id
      requestParent.status = 'Proceed with repair';
      requestParent.repairman_id = repairmanId;
      //Thay đổi trạng thái thợ

      // Tạo mới bảng Price và thêm price của thợ vào
      const newPrice = new Price({
        duePrice_id: Due_Price._id,
        priceToPay: dealPriceValue, // Lấy giá từ dealPriceValue
      });
      await newPrice.save(); // Lưu Price mới và lấy _id

      await requestParent.save();

      // Cập nhật trạng thái RepairmanUpgradeRequest cho thợ được chọn thành 'Proceed with repair'
      //const selectedRepairmanUpgradeRequest = await RepairmanUpgradeRequest.findById(repairmanId);
      repairmanUpgradeRequest.status = 'Proceed with repair';
      await repairmanUpgradeRequest.save();

      // Cập nhật trạng thái RepairmanUpgradeRequest cho các thợ không được chọn (trở lại 'Active')
      if (requestChild && requestChild.length > 0) {
        await Promise.all(requestChild.map(async (childRequest) => {
          const repairmanUpgradeRequest = await RepairmanUpgradeRequest.findById(childRequest.repairman_id);
          if (repairmanUpgradeRequest && childRequest.repairman_id.toString() !== repairmanId) { // Check if not the selected repairman
            repairmanUpgradeRequest.status = "Active";
            await repairmanUpgradeRequest.save();
          }
          // Tìm và xóa Price liên quan đến DuePrice liên quan đến childRequest
          const duePrice = await DuePrice.findOne({ request_id: childRequest._id });
          if (duePrice) {
            await Price.deleteMany({ duePrice_id: duePrice._id });
            await DuePrice.deleteOne({ _id: duePrice._id });
          }
          // Xóa childRequest
          await Request.deleteOne({ _id: childRequest._id });
        }));
      }

      // Create transaction records for both customer and repairman
      const customerTransaction = new Transaction({
        wallet_id: customerWallet._id,
        payCode: `PAY-SEV-${Math.floor(Math.random() * 900000) + 100000}`,
        transactionType: 'payment',
        status: 1,
        amount: dealPriceValue,
        content: `Thanh toán cho yêu cầu sửa chữa mã số ${requestId} cho thợ sửa chữa ${repairmanInfor.firstName} ${repairmanInfor.lastName}`,
        request_id: requestId,
      });
      await customerTransaction.save();

      // const repairmanTransaction = new Transaction({
      //   wallet_id: repairmanWallet._id,
      //   transactionType: 'deposite',
      //   amount: dealPriceValue,
      //   content: `Nhận thanh toán cho yêu cầu sửa chữa mã số ${requestId} từ khách hàng ${req.user.firstName} ${req.user.lastName}`,
      //   request_id: requestId,
      // });
      // await repairmanTransaction.save();

      // Xóa các request con và dữ liệu liên quan sau khi thanh toán thành công
      if (requestChild && requestChild.length > 0) {
        await Promise.all(requestChild.map(async (childRequest) => {
          const repairman = await RepairmanUpgradeRequest.findById(childRequest.repairman_id);
          if (repairman) {
            repairman.status = "Active";
          }
          // Tìm và xóa Price liên quan đến DuePrice liên quan đến childRequest
          const duePrice = await DuePrice.findOne({ request_id: childRequest._id });
          if (duePrice) {
            await Price.deleteMany({ duePrice_id: duePrice._id });
            await DuePrice.deleteOne({ _id: duePrice._id });
          }
          // Xóa childRequest
          await Request.deleteOne({ _id: childRequest._id });
        }));
      }

      // Gửi thông báo WebSocket tới thợ (không gửi dữ liệu chi tiết)
      const repairmanUserId = repairmanInfor._id.toString();
      console.log('Sending repairmanAssigned to repairman:', repairmanUserId);
      io.to(repairmanUserId).emit('repairmanAssigned');

      res.status(200).json({
        EC: 1,
        EM: "Thanh toán thành công và yêu cầu đã được giao cho thợ sửa chữa!",
        DT: {
          customerBalance: customerWallet.balance,
          request: requestParent,
          repairman: repairmanInfor
        },
      });

    } catch (error) {
      // If error, rollback transaction if started
      // await session.abortTransaction();
      // session.endSession();
      console.error("Error processing payment and assigning repairman:", error);
      return res.status(500).json({
        EC: 0,
        EM: "Đã có lỗi xảy ra trong quá trình thanh toán và giao yêu cầu. Vui lòng thử lại sau!",
      });
    }

  } catch (error) {
    console.error("Error in assignedRepairman API:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!",
    });
  }
}
const getRequestCompleted = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findOne({
      _id: requestId,
      status: "Completed"
    }).select('repairman_id updatedAt')
    if (!request) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy đơn hàng!"
      });
    }
    const repairman = await RepairmanUpgradeRequest.findById(request.repairman_id);
    const repairmanInfo = await User.findById(repairman.user_id).select('firstName lastName');



    res.status(200).json({
      EC: 1,
      EM: "Hiển thị thông tin thợ và đơn hàng thành công",
      DT: {
        request: request,
        repairman: repairmanInfo,
      }
    })
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
    });
  }
}
const confirmRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { confirm } = req.body;
    // if(!confirm){
    //   return res.status(400).json({
    //     EC: 0,
    //     EM: "Vui lòng cung cấp xác nhận",
    //   });
    // }
    const request = await Request.findOne({
      user_id: userId,
      status: "Proceed with repair",
    }).sort({ createdAt: -1 })
      .populate({
        path: 'repairman_id',
        populate: { // No need to populate user_id again, repairman_id should already contain necessary info
          path: 'user_id',
          select: 'firstName lastName email' // Select email here to ensure it's retrieved
        }
      })
    if (!request) {
      res.status(404).json({
        EC: 0,
        EM: "Không thấy đơn hàng",
      })
    }
    const walletRepairman = await Wallet.findOne({ user_id: request.repairman_id.user_id });
    if (!walletRepairman) {
      res.status(404).json({
        EC: 0,
        EM: "Không thấy ví của thợ",
      })
    }
    const duePrice = await DuePrice.findOne({ request_id: request._id });
    const price = await Price.findOne({ duePrice_id: duePrice._id });

    if (confirm === "Completed" || (new Date() - request.updatedAt) / (1000 * 60 * 60) > 12) {


      // Credit to repairman wallet
      walletRepairman.balance += (price.priceToPay * 0.85);//ăn hoa hồng ở đây
      await walletRepairman.save();

      const repairmanTransaction = new Transaction({
        wallet_id: walletRepairman._id,
        payCode: `REC-SEV-${Math.floor(Math.random() * 90000000) + 10000000}`,
        transactionType: 'deposite',
        status: 1,
        amount: price.priceToPay * 0.85,
        content: `Nhận thanh toán cho yêu cầu sửa chữa mã số ${request._id} từ khách hàng ${req.user.firstName} ${req.user.lastName}`,
        request_id: request._id,
      });

      // Gửi email xác nhận cho thợ
      // Check if request.repairman_id and request.repairman_id.email exist before sending email
      if (request.repairman_id && request.repairman_id.user_id.email) {
        await sendEmail(request.repairman_id.user_id.email, "Đơn hàng đã hoàn thành",
          `<p>Chào ${request.repairman_id.user_id.firstName} ${request.repairman_id.user_id.lastName},</p>
            <p>Đơn hàng ${request._id} đã được xác nhận hoàn thành</strong>.</p>
            <p>Số tiền ${price.priceToPay * 0.85} đã được chuyển về ví của bạn</p>`
        );
      } else {
        console.error("Không thể gửi email xác nhận hoàn thành đơn hàng vì thiếu thông tin người nhận.");
      }
      await repairmanTransaction.save();
      request.status = "Completed";
      //request.repairman_id.status = "Active";
      await request.save();
      res.status(201).json({
        EC: 1,
        EM: "Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi, đơn hàng của bạn đã được xác nhận thành công",

      })
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      EC: 0,
      EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
    });
  }
}
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
  getUserInfo,
  sendRequest,
  findRepairman,
  viewRepairmanDeal,
  assignedRepairman,
  getRequestCompleted,
  confirmRequest
};
