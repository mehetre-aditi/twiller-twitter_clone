const LoginHistory = require('../models/LoginHistory');

const saveLoginHistory = async (details) => {
    const history = new LoginHistory(details);
    await history.save();
};

const getLoginHistory = async (userId) => {
    return await LoginHistory.find({ userId }).sort({ timestamp: -1 });
};

module.exports = { saveLoginHistory, getLoginHistory };

