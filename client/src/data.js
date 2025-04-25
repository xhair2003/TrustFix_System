export const mockPosts = [
    {
        id: 1,
        title: "Cách sửa ống nước bị rò rỉ tại nhà",
        content: "Trước tiên, bạn cần khóa van nước tổng. Sau đó...",
        category: "Sửa ống nước",
        tags: ["ống nước", "mẹo sửa chữa"],
        user: { id: 1, name: "Nguyễn Văn A", role: "customer" },
        likes: 10,
        comments: [
            { id: 1, user: "Trần Văn B", content: "Cảm ơn, rất hữu ích!", createdAt: "2025-04-10" },
            { id: 2, user: "Lê Thị C", content: "Có cần dụng cụ gì đặc biệt không?", createdAt: "2025-04-11" },
        ],
        createdAt: "2025-04-09",
    },
    {
        id: 2,
        title: "Kinh nghiệm chọn thợ sửa điện uy tín",
        content: "Nên kiểm tra đánh giá và hỏi rõ chi phí trước...",
        category: "Sửa điện",
        tags: ["sửa điện", "kinh nghiệm"],
        user: { id: 2, name: "Trần Văn B", role: "worker" },
        likes: 5,
        comments: [],
        createdAt: "2025-04-08",
    },
];

export const categories = ["Sửa ống nước", "Sửa điện", "Đồ gỗ", "Khác"];


export const mockGuides = [
    {
        id: 1,
        title: "Cách thông cống tại nhà",
        type: "video",
        content: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Link giả lập
        description: "Hướng dẫn chi tiết cách thông cống bằng dụng cụ đơn giản.",
        category: "Sửa ống nước",
        tags: ["thông cống", "mẹo sửa chữa"],
        createdBy: { id: 1, name: "Admin", role: "admin" },
        createdAt: "2025-04-01",
    },
    {
        id: 2,
        title: "Hướng dẫn thay bóng đèn an toàn",
        type: "article",
        content: "1. Tắt nguồn điện. 2. Tháo bóng cũ. 3. Lắp bóng mới. 4. Bật điện kiểm tra.",
        description: "Các bước cơ bản để thay bóng đèn mà không cần thợ.",
        category: "Sửa điện",
        tags: ["bóng đèn", "sửa điện"],
        createdBy: { id: 2, name: "Trần Văn B", role: "worker" },
        createdAt: "2025-04-02",
    },
];