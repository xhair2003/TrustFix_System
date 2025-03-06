const {
  User,
  Role,
  RepairmanUpgradeRequest,
  ServiceIndustry,
  Vip,
} = require("../models");

const requestRepairmanUpgrade = async (req, res) => {
  try {
    const userId = req.user.id; // User ID from verified token
    //const serviceIndustryId = req.body.serviceIndustry_Id;
        const { serviceIndustry_Id, typePaper, imgPaper, description} = req.body;

    // Validate required fields
    if (!serviceIndustry_Id || !typePaper || !imgPaper || !description) {
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
        const serviceIndustry = await ServiceIndustry.findOne({ _id: serviceIndustry_Id });
    if (!serviceIndustry) {
      return res.status(404).json({
        EC: 0,
                EM: "Không tìm thấy loại hình dịch vụ!"
      });
    }

    // Create new Repairman Upgrade Request
    const newRequest = new RepairmanUpgradeRequest({
      user_id: userId,
      serviceIndustry_id: serviceIndustry._id,
      typePaper: typePaper,
      imgPaper: imgPaper,
      description: description,
      status: 1, // Default status: Pending
            
    });

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

const getPendingUpgradeRequests = async (req, res) => {
  try {
    const pendingRequests = await RepairmanUpgradeRequest.find({ status: 1 })
            .populate('user', 'firstName lastName email') // Populate user details
            .populate('serviceIndustry', 'type'); // Populate service industry type

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
                EM: "Vui lòng cung cấp ID yêu cầu và hành động (approve/reject)!"
      });
    }

        const upgradeRequest = await RepairmanUpgradeRequest.findById(requestId).populate('user');
    if (!upgradeRequest) {
      return res.status(404).json({
        EC: 0,
                EM: "Không tìm thấy yêu cầu nâng cấp!"
      });
    }

        if (action === 'approve') {
      // Update request status to approved
      upgradeRequest.status = 2;
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
                    type: 'repairman'
        });
        await userRole.save();
      }


      res.status(200).json({
        EC: 1,
                EM: "Yêu cầu nâng cấp đã được phê duyệt thành công! Người dùng đã được chuyển thành thợ sửa chữa."
      });

        } else if (action === 'reject') {
      if (!rejectReason) {
        return res.status(400).json({
          EC: 0,
                    EM: "Vui lòng cung cấp lý do từ chối khi từ chối yêu cầu!"
        });
      }
      // Update request status to rejected
      upgradeRequest.status = 0;
      upgradeRequest.rejectedAt = Date.now();
      upgradeRequest.rejectReason = rejectReason;
      await upgradeRequest.save();

      res.status(200).json({
        EC: 1,
                EM: "Yêu cầu nâng cấp đã bị từ chối thành công!"
      });
    } else {
      return res.status(400).json({
        EC: 0,
                EM: "Hành động không hợp lệ! Vui lòng chọn 'approve' hoặc 'reject'."
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

const getAllVips = async (req, res) => {
  try {
    let { page = 1, limit = 10, search } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({
        EC: 1,
        EM: "Giá trị page hoặc limit không hợp lệ!",
        data: [],
      });
    }

    let filter = {};
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: "i" } },
        { price: isNaN(search) ? null : parseFloat(search) },
      ];
    }

    const vips = await Vip.find(filter)
      .populate({
        path: "user_id",
        model: User,
        select: "firstName lastName email phone",
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalVips = await Vip.countDocuments(filter);
    const totalPages = Math.ceil(totalVips / limit);

    return res.status(200).json({
      EC: 0,
      EM: "Lấy danh sách VIP thành công!",
      data: {
        currentPage: page,
        totalPages,
        totalRecords: totalVips,
        vips,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      EC: 1,
      EM: "Lỗi server, vui lòng thử lại sau!",
      data: [],
    });
  }
};

module.exports = {
  requestRepairmanUpgrade,
  getPendingUpgradeRequests,
  verifyRepairmanUpgradeRequest,
  getAllVips,
};
