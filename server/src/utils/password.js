const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    if (!password) {
        throw new Error('Password is required');
    }
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

module.exports = hashPassword;
