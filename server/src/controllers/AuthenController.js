const {models,User }= require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Get JWT settings from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "TrustFix_System_jwt_secret_key_2024";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";


const register = async (req, res) => {
    try {
        // console.log("==== REGISTER REQUEST DEBUG ====");
        // console.log("Request headers:", req.headers);
        // console.log("Content-Type:", req.headers['content-type']);
        
        // Log raw request body
        if (req.rawBody) {
            console.log("Raw request body:", req.rawBody);
            try {
                const parsedRawBody = JSON.parse(req.rawBody);
                console.log("Parsed raw body:", parsedRawBody);
                // If main body is empty but raw body has content, use it
                if (Object.keys(req.body).length === 0 && Object.keys(parsedRawBody).length > 0) {
                    req.body = parsedRawBody;
                }
            } catch (e) {
                console.error("Failed to parse raw body:", e);
            }
        }
        
        // console.log("Request body (raw):", req.body);
        // console.log("Request body type:", typeof req.body);
        // console.log("Request body stringified:", JSON.stringify(req.body));
        // console.log("==============================");
        
        // Try to parse the body manually if it's a string
        let parsedBody = req.body;
        if (typeof req.body === 'string') {
            try {
                parsedBody = JSON.parse(req.body);
                console.log("Manually parsed body:", parsedBody);
            } catch (e) {
                console.error("Failed to parse body string:", e);
            }
        }
        
        // Extract fields from either source
        const body = parsedBody || req.body;
        const { firstName, lastName, email, pass, confirmPassword, phone, role } = body;
        
        // console.log("Fields extracted:");
        // console.log("firstName:", firstName);
        // console.log("lastName:", lastName);
        // console.log("email:", email);
        // console.log("pass:", pass ? "provided" : "missing");
        // console.log("confirmPassword:", confirmPassword ? "provided" : "missing");
        // console.log("phone:", phone);
        // console.log("role:", role);

        // Validate required fields
        if (!firstName || !lastName || !email || !pass || !confirmPassword || !phone || !role) {
            return res.status(400).json({ 
                EC: 0, 
                EM: "Vui lòng điền đầy đủ thông tin, bao gồm vai trò!" 
            });
        }

        // Validate role
        if (!['customer', 'repairman', 'admin'].includes(role)) {
            return res.status(400).json({ 
                EC: 0, 
                EM: "Vai trò không hợp lệ! Vai trò phải là customer, repairman hoặc admin." 
            });
        }

        // Validate password match
        if (pass !== confirmPassword) {
            return res.status(400).json({ 
                EC: 0, 
                EM: "Mật khẩu không khớp!" 
            });
        }

        // Validate password length - at least 8 characters
        if (pass.length < 8) {
            return res.status(400).json({ 
                EC: 0, 
                EM: "Mật khẩu phải có ít nhất 8 ký tự!" 
            });
        }

        // Check if email already exists
        const existingEmail = await models.User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ 
                EC: 0, 
                EM: "Email đã được sử dụng!" 
            });
        }

        // Check if phone already exists
        const existingPhone = await models.User.findOne({ where: { phone } });
        if (existingPhone) {
            return res.status(400).json({ 
                EC: 0, 
                EM: "Số điện thoại đã được sử dụng!" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        // Create new user with transaction to ensure both user and role are created
        const result = await models.sequelize.transaction(async (t) => {
            // Create user
            const newUser = await models.User.create({
                firstName,
                lastName,
                email,
                pass: hashedPassword,
                phone,
                status: 1
            }, { transaction: t });

            // Create role for the user
            await models.Role.create({
                user_id: newUser.id,
                type: role
            }, { transaction: t });

            return newUser;
        });

        // Remove password from response
        const userResponse = result.toJSON();
        delete userResponse.pass;

        res.status(201).json({ 
            EC: 1, 
            EM: "Đăng ký thành công!", 
            DT: userResponse 
        });

    } catch (err) {
        console.error('Register error:', err);
        
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                EC: 0, 
                EM: "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!" 
            });
        }

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

        // Find user by email
        const user = await models.User.findOne({ 
            where: { email },
            include: [{
                model: models.Role,
                as: 'roles'
            }]
        });

        // If user doesn't exist
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

        // Create JWT token with user information and roles
        const token = jwt.sign(
            { 
                id: user.id,
                email: user.email,
                roles: roles
            }, 
            JWT_SECRET, 
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Create user response without password
        const userResponse = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            roles: roles,
            status: user.status
        };

        // Return success with token and user information
        res.status(200).json({
            EC: 1,
            EM: "Đăng nhập thành công!",
            DT: {
                token,
                user: userResponse
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

const testBodyParser = (req, res) => {
    console.log("==== TEST BODY PARSER ====");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("========================");
    
    return res.status(200).json({
        message: "Test endpoint",
        receivedBody: req.body,
        contentType: req.headers['content-type']
    });
};
//CHANGE PASSWORD
 const changePassword = async (req, res) => {
      const userID = req.user.id;
      const {oldpass , newpass} = req.body;
       try {
         if (!newpass|| newpass.length < 8) {
            console.log('Password must be at least 8 characters');
            
            return res.status(400).json({ 
                EC: 0,
                EM: 'Password must be at least 8 characters' }); 
            }   
         const user = await User.findOne({ where: { id: userID } });
         if (!user) {
            console.log('User not found');
            return res.status(404).json({ 
                EC: 0,
                EM: 'User not found' });
            }
        const check =   await bcrypt.compare(oldpass, user.pass);  
        if (!check) {
            console.log('Old password is incorrect');
            return res.status(400).json({ 
                EC: 0,
                EM: 'Old password is incorrect' });
            }
        const hashedPassword = await bcrypt.hash(newpass, 10);

        await user.update({ pass: hashedPassword }, { where: { id: userID } });
        return res.status(200).json({
            EC: 1,
            EM: 'Password changed successfully'
        });
       } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ message: 'Internal server error' });
       }
    };

module.exports = {
    register,
    login,
    testBodyParser,
    changePassword
};