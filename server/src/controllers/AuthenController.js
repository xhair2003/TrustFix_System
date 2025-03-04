const { User, Role } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT configuration
const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY || "your_jwt_access_secret_key";
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY || "your_jwt_refresh_secret_key";
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@trustfix.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Generate tokens
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        JWT_ACCESS_KEY,
        { expiresIn: "1d" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role
        },
        JWT_REFRESH_KEY,
        { expiresIn: "7d" }
    );
};

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, pass, confirmPassword, phone, role = "customer" } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !pass || !confirmPassword || !phone) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng điền đầy đủ thông tin!"
            });
        }

        // Validate password match
        if (pass !== confirmPassword) {
            return res.status(400).json({
                EC: 0,
                EM: "Mật khẩu không khớp!"
            });
        }

        // Validate password length
        if (pass.length < 8) {
            return res.status(400).json({
                EC: 0,
                EM: "Mật khẩu phải có ít nhất 8 ký tự!"
            });
        }

        // Check existing email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                EC: 0,
                EM: "Email đã được sử dụng!"
            });
        }

        // Check existing phone
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                EC: 0,
                EM: "Số điện thoại đã được sử dụng!"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            pass: hashedPassword,
            phone,
            status: 1
        });

        // Save user
        const savedUser = await newUser.save();

        // Create role for user
        const newRole = new Role({
            user_id: savedUser._id,
            type: role
        });
        await newRole.save();

        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.pass;

        res.status(201).json({
            EC: 1,
            EM: "Đăng ký thành công!",
            DT: userResponse
        });

    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, pass } = req.body;

        // Validate required fields
        if (!email || !pass) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập email và mật khẩu!"
            });
        }

        // Check if it's admin login
        if (email === DEFAULT_ADMIN_EMAIL && pass === DEFAULT_ADMIN_PASSWORD) {
            const adminUser = {
                _id: "admin",
                email: DEFAULT_ADMIN_EMAIL,
                role: "admin",
                firstName: "Admin",
                lastName: "System"
            };
            const accessToken = generateAccessToken(adminUser);
            const refreshToken = generateRefreshToken(adminUser);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                EC: 1,
                EM: "Đăng nhập thành công!",
                DT: {
                    ...adminUser,
                    accessToken
                }
            });
        }

        // Find user and populate roles
        const user = await User.findOne({ email }).populate('roles');
        if (!user) {
            return res.status(401).json({
                EC: 0,
                EM: "Email không tồn tại!"
            });
        }

        // Check if user is active
        if (user.status !== 1) {
            return res.status(401).json({
                EC: 0,
                EM: "Tài khoản đã bị vô hiệu hóa!"
            });
        }

        // Verify password
        const validPassword = await bcrypt.compare(pass, user.pass);
        if (!validPassword) {
            return res.status(401).json({
                EC: 0,
                EM: "Mật khẩu không chính xác!"
            });
        }

        // Get user roles
        const roles = user.roles ? user.roles.map(role => role.type) : [];
        if (roles.length === 0) {
            return res.status(401).json({
                EC: 0,
                EM: "Tài khoản không có quyền truy cập!"
            });
        }

        // Create tokens
        const accessToken = generateAccessToken({ ...user.toObject(), role: roles[0] });
        const refreshToken = generateRefreshToken({ ...user.toObject(), role: roles[0] });

        // Set refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Create user response without password
        const userResponse = user.toObject();
        delete userResponse.pass;

        res.status(200).json({
            EC: 1,
            EM: "Đăng nhập thành công!",
            DT: {
                ...userResponse,
                roles,
                accessToken
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                EC: 0,
                EM: "You're not authenticated!"
            });
        }

        jwt.verify(refreshToken, JWT_REFRESH_KEY, async (err, user) => {
            if (err) {
                return res.status(403).json({
                    EC: 0,
                    EM: "Refresh token is not valid!"
                });
            }

            // Create new access token
            const newAccessToken = generateAccessToken(user);

            res.status(200).json({
                EC: 1,
                EM: "Refresh token success!",
                DT: {
                    accessToken: newAccessToken
                }
            });
        });
    } catch (err) {
        console.error('Refresh token error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const logout = async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict"
    });
    return res.status(200).json({
        EC: 1,
        EM: "Logged out successfully!"
    });
};

module.exports = {
    register,
    login,
    refreshToken,
    logout
};