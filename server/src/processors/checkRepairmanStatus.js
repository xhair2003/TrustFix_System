const { RepairmanUpgradeRequest, Request, User } = require('../models');

const checkRepairmanStatus = async () => {
    try {
        // Find all requests that are pending and have both VIP and non-VIP repairmen
        const requests = await Request.find({ status: 'Pending' });

        for (const request of requests) {
            const repairmanUpgradeRequests = await RepairmanUpgradeRequest.find({
                serviceIndustry_id: request.serviceIndustry_id,
                user_id: { $ne: request.user_id },
            });

            const vipRepairmen = [];
            const nonVipRepairmen = [];

            for (const upgradeRequest of repairmanUpgradeRequests) {
                if (upgradeRequest.vip_id) {
                    vipRepairmen.push(upgradeRequest.user_id);
                } else {
                    nonVipRepairmen.push(upgradeRequest.user_id);
                }
            }

            // If there are both VIP and non-VIP repairmen
            if (vipRepairmen.length > 0 && nonVipRepairmen.length > 0) {
                // Update status of non-VIP repairmen after a delay
                setTimeout(async () => {
                    for (const userId of nonVipRepairmen) {
                        const user = await User.findById(userId);
                        if (user) {
                            // Update the status or perform any other necessary action
                            //console.log(`Updating status for non-VIP repairman: ${userId}`);
                            // Example: user.status = 'Available';
                            // await user.save();
                        }
                    }
                }, 60000); // 1 minute delay
            }
        }
    } catch (error) {
        console.error('Error in checkRepairmanStatus:', error);
    }
};

module.exports = checkRepairmanStatus; 