const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    if (!password) {
        throw new Error("Password is required");
    }
    try {
        const saltRounds = 10;  // Số vòng tạo salt để bảo mật
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Error hashing password");
    }
};

module.exports = hashPassword;  // Xuất trực tiếp hàm này
