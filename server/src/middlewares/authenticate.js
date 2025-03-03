
const {User , sequelize} = require('../models');

const ValidateEmailPhone = async (req, res, next) => { 
     const { email, phone } = req.body;
     try {
        const [existtingEmail, existingPhone] = await Promise.all([
            User.findOne({ where: { email } }),
            User.findOne({ where: { phone } })
        ]);
        if (existtingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        else if (existingPhone) {
            return res.status(400).json({ message: 'Phone already exists' });
        }
        else {
            next();
        }
     } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
     }
}

 const checkEmtyUser = async (req, res, next) => { 
    const { firstName, lastName, phone, email, password } = req.body;
    if (!firstName || !lastName || !phone || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    else {
        next();
    }
 }
module.exports =  {ValidateEmailPhone, checkEmtyUser};    

