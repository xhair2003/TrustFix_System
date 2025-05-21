const MONTHLY_FEE = 100000; // 100,000 VND per month

const CRON_TIME = {
  EVERY_MINUTE: "* * * * *",          // Chạy mỗi phút
  EVERY_HOUR: "0 * * * *",            // Chạy mỗi giờ
  EVERY_DAY_AT_MIDNIGHT: "0 0 * * *", // Chạy mỗi ngày vào 00:00
  EVERY_WEEK: "0 0 * * 0",            // Chạy mỗi tuần vào Chủ Nhật lúc 00:00
  EVERY_MONTH: "0 0 1 * *",           // Chạy vào 00:00 ngày 1 hàng tháng
  EVERY_YEAR: "0 0 1 1 *"             // Chạy vào ngày 1 tháng 1 hàng năm
};

const PROHIBITED_PATTERNS = [
  /\b(\d{10}|\d{3}-\d{3}-\d{4}|\d{3}\.\d{3}\.\d{4})\b/,
  /(https?:\/\/[^\s]+)/i,
  /\b(số nhà|đường|phố|quận|huyện|thành phố|tp\.|tỉnh)\b/i,
  /\b(điện|fb|web|số điện thoại|số|điện thoại|sửa chữa|liên hệ|đặt lịch|thuê|ngoài hệ thống|chợ tốt|facebook|website)\b/i,
];

const PROHIBITED_PATTERN = [
  {
    pattern: /\b(\d{10}|\d{3}-\d{3}-\d{4}|\d{3}\.\d{3}\.\d{4})\b/,
    description: 'Số điện thoại (10 số hoặc định dạng XXX-XXX-XXXX, XXX.XXX.XXXX)',
  },
  {
    pattern: /(https?:\/\/[^\s]+)/i,
    description: 'Link (http hoặc https)',
  },
  {
    pattern: /\b(số nhà|đường|phố|quận|huyện|thành phố|tp\.|tỉnh)\b/i,
    description: 'Thông tin địa chỉ (số nhà, đường, phố, quận, ...)',
  },
  {
    pattern: /\b(điện|fb|web|số điện thoại|số|điện thoại|sửa chữa|liên hệ|đặt lịch|thuê|ngoài hệ thống|chợ tốt|facebook|website|zalo)\b/i,
    description: 'Từ khóa nhạy cảm (facebook, zalo, liên hệ, ...)',
  },
];

// Hàm kiểm tra tin nhắn vi phạm
const checkProhibitedContent = (message) => {
  const violations = [];

  for (const { pattern, description } of PROHIBITED_PATTERN) {
    if (pattern.test(message)) {
      const matched = message.match(pattern)?.[0] || 'không xác định';
      violations.push({ matched, description });
    }
  }

  return {
    isViolated: violations.length > 0,
    violations,
  };
};

module.exports = { MONTHLY_FEE, CRON_TIME, PROHIBITED_PATTERNS, checkProhibitedContent };

