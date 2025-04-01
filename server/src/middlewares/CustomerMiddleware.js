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

const viewRepairmanDeal = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const userId = req.user.id;

        console.log("requestId", requestId);

        const requests = await Request.find({
            user_id: userId,
            repairman_id: { $ne: null },
            parentRequest: requestId,
            status: 'Done deal price'
        });

        // console.log("requestId", requestId);
        // console.log("userId", userId);
        // console.log("requests", requests);
        // console.log("requests length", requests.length);

        if (!requests || requests.length === 0) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy yêu cầu deal giá phù hợp!"
            });
        }

        const repairmanDeals = [];

        for (const request of requests) {
            const repairman = await RepairmanUpgradeRequest.findById(request.repairman_id);
            const repairmanInfor = await User.findById(repairman.user_id).select('firstName lastName email phone imgAvt address description');

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
        req.repairmanDeals = repairmanDeals;
        next();
        // res.status(201).json({
        //     EC: 1,
        //     EM: "Hiển thị thông tin thợ thành công!",
        //     DT: repairmanDeals
        // });
    } catch (error) {
        console.error("Error in dealPrice API:", error);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

module.exports = {
    viewRepairmanDeal
};