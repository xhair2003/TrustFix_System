const { User, Role } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const hashPassword  = require("../utils/password");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


// JWT configuration
const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY || "your_jwt_access_secret_key";
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY || "your_jwt_refresh_secret_key";
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@trustfix.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Store OTP codes (in production, use Redis or database)
const otpStore = new Map();

// Store pending registrations (in production, use Redis or database)
const pendingRegistrations = new Map();

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

// Generate OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const initRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, pass, confirmPassword, phone, role } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !pass || !confirmPassword || !phone || !role) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng điền đầy đủ thông tin, bao gồm vai trò!"
            });
        }

        // Validate role
        const validRoles = ['customer', 'repairman'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                EC: 0,
                EM: "Vai trò không hợp lệ! Vai trò phải là customer hoặc repairman"
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
                EM: "Email đã tồn tại trong hệ thống!"
            });
        }

        // Check existing phone
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                EC: 0,
                EM: "Số điện thoại đã tồn tại trong hệ thống!"
            });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store registration data temporarily
        pendingRegistrations.set(email, {
            firstName,
            lastName,
            email,
            pass,
            phone,
            role,
            otp,
            expiry: Date.now() + 5 * 60 * 1000 // 5 minutes expiry
        });

        // Send verification email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Xác thực đăng ký tài khoản TrustFix',
            html: `
                <h1>Xác thực email đăng ký</h1>
                <p>Xin chào ${firstName} ${lastName},</p>
                <p>Cảm ơn bạn đã đăng ký tài khoản ${role} tại TrustFix.</p>
                <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
                <p>Mã này sẽ hết hạn sau 5 phút.</p>
                <p>Nếu bạn không yêu cầu đăng ký tài khoản, vui lòng bỏ qua email này.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            EC: 1,
            EM: "Mã OTP đã được gửi đến email của bạn!"
        });

    } catch (err) {
        console.error('Registration init error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const verifyRegister = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập đầy đủ thông tin!"
            });
        }

        // Get pending registration
        const registration = pendingRegistrations.get(email);
        if (!registration) {
            return res.status(400).json({
                EC: 0,
                EM: "Không tìm thấy thông tin đăng ký hoặc đã hết hạn!"
            });
        }

        // Verify OTP
        if (registration.otp !== otp) {
            return res.status(400).json({
                EC: 0,
                EM: "Mã OTP không chính xác!"
            });
        }

        // Check expiry
        if (Date.now() > registration.expiry) {
            pendingRegistrations.delete(email);
            return res.status(400).json({
                EC: 0,
                EM: "Mã OTP đã hết hạn!"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(registration.pass, salt);

        // Create new user
        const newUser = new User({
            firstName: registration.firstName,
            lastName: registration.lastName,
            email: registration.email,
            pass: hashedPassword,
            phone: registration.phone,
            status: 1
        });

        // Save user
        const savedUser = await newUser.save();

        // Create role for user
        const newRole = new Role({
            user_id: savedUser._id,
            type: registration.role // Sử dụng role từ registration
        });

        // Save role
        await newRole.save();

        // Remove pending registration
        pendingRegistrations.delete(email);

        // Generate tokens
        const userWithRole = {
            ...savedUser.toObject(),
            role: registration.role
        };
        const accessToken = generateAccessToken(userWithRole);
        const refreshToken = generateRefreshToken(userWithRole);

        // Set refresh token in cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.pass;

        res.status(201).json({
            EC: 1,
            EM: "Đăng ký thành công!",
            DT: {
                ...userResponse,
                role: registration.role,
                accessToken
            }
        });

    } catch (err) {
        console.error('Registration verification error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, pass } = req.body;
        console.log(pass);
        
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


///Change password
const changePassword = async (req, res) => {
    try {
        const { pass , newPass , confirmNewPass } = req.body;


        const user_id = req.user.id;

        if (!pass || !newPass || !confirmNewPass) {
            return res.status(400).json({ EC: 0, EM: "Vui lòng nhập đầy đủ thông tin!" });
        }

        if (newPass !== confirmNewPass) {
            return res.status(400).json({ EC: 0, EM: "Mật khẩu mới không khớp!" });
        }
        if (newPass.length < 8) {
            return res.status(400).json({ EC: 0, EM: "Mật khẩu mới phải có ít nhất 8 ký tự!" });
        }
        // Mã hóa mật khẩu mới
        const hashedPassword = await hashPassword(newPass);

        // Lưu mật khẩu đã mã hóa vào cơ sở dữ liệu
        const user = await User.findById(req.user.id);
        user.pass = hashedPassword;
        await user.save();

        return res.status(200).json({ EC: 1, EM: "Đổi mật khẩu thành công!" });

    } catch (err) {
        console.error("Change password error:", err);
        res.status(500).json({ EC: 0, EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!" });
    }
};





const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập email!"
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                EC: 0,
                EM: "Email không tồn tại trong hệ thống!"
            });
        }

        // Generate OTP
        const otp = generateOTP();
        
        // Store OTP with expiration (5 minutes)
        otpStore.set(email, {
            code: otp,
            expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
        });

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset mật khẩu TrustFix',
            html: `
                <h1>Yêu cầu đặt lại mật khẩu</h1>
                <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
                <p>Mã này sẽ hết hạn sau 5 phút.</p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            EC: 1,
            EM: "Mã OTP đã được gửi đến email của bạn!"
        });

    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập đầy đủ thông tin!"
            });
        }

        // Check if OTP exists and is valid
        const storedOTP = otpStore.get(email);
        if (!storedOTP || storedOTP.code !== otp) {
            return res.status(400).json({
                EC: 0,
                EM: "Mã OTP không chính xác!"
            });
        }

        // Check if OTP is expired
        if (Date.now() > storedOTP.expiry) {
            otpStore.delete(email);
            return res.status(400).json({
                EC: 0,
                EM: "Mã OTP đã hết hạn!"
            });
        }

        // Generate temporary token for password reset
        const resetToken = jwt.sign({ email }, JWT_ACCESS_KEY, { expiresIn: '5m' });

        res.status(200).json({
            EC: 1,
            EM: "Xác thực OTP thành công!",
            DT: { resetToken }
        });

    } catch (err) {
        console.error('Verify OTP error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword, confirmPassword } = req.body;

        // Validate input
        if (!resetToken || !newPassword || !confirmPassword) {
            return res.status(400).json({
                EC: 0,
                EM: "Vui lòng nhập đầy đủ thông tin!"
            });
        }

        // Verify passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                EC: 0,
                EM: "Mật khẩu không khớp!"
            });
        }

        // Verify token
        const decoded = jwt.verify(resetToken, JWT_ACCESS_KEY);
        const email = decoded.email;

        // Find and update user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy người dùng!"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.pass = hashedPassword;
        await user.save();

        // Clear OTP
        otpStore.delete(email);

        res.status(200).json({
            EC: 1,
            EM: "Đặt lại mật khẩu thành công!"
        });

    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(400).json({
                EC: 0,
                EM: "Token không hợp lệ hoặc đã hết hạn!"
            });
        }
        console.error('Reset password error:', err);
        res.status(500).json({
            EC: 0,
            EM: "Đã có lỗi xảy ra. Vui lòng thử lại sau!"
        });
    }
};




module.exports = {
    initRegister,
    verifyRegister,
    login,
    refreshToken,
    logout,
    changePassword,
    forgotPassword,
    verifyOTP,
    resetPassword,
};