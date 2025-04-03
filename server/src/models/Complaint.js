const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request', // Tham chiếu đến model Request
        required: true,
    }, // ID của Request liên quan, từ đó lấy user_id
    complaintContent: {
        type: String,
        required: true
    }, // Nội dung khiếu nại
    complaintType: {
        type: String,
        enum: ['Chất lượng sửa chữa không đạt', 'Thợ đến muộn/không đến', 'Thái độ không chuyên nghiệp', 'Dịch vụ kém','Khác'],
        
    }, // Loại khiếu nại
    requestResolution: {
        type: String,
        enum: ['Hoàn tiền', 'Sửa chữa lại', 'Đền bù thiệt hại', 'Khác'],
        // required: true
    }, // Yêu cầu giải quyết khiếu nại
    image: {
        type: [String], // Hoặc có thể dùng Array [String] nếu muốn cho phép nhiều ảnh
        required: false // Tùy chọn, có thể không bắt buộc phải có ảnh
    }, // Hình ảnh minh chứng (URL hoặc path)
    parentComplaint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        default: null
    }, // Nếu là phản hồi, tham chiếu đến khiếu nại cha
    status: {
        type: String,
        enum: ['pending', 'replied', "ok"], // Trạng thái khiếu nại (chưa phản hồi hoặc đã phản hồi)
        default: 'pending', // Mặc định là 'pending'
    }, // Trạng thái của khiếu nại
}, { timestamps: true });

// Ảo trường (Virtual field) để lấy danh sách phản hồi
ComplaintSchema.virtual('replies', {
    ref: 'Complaint',
    localField: '_id',
    foreignField: 'parentComplaint'
});
ComplaintSchema.virtual('request', {
    ref: 'Request',
    localField: 'request_id',
    foreignField: '_id',
    justOne: true
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
