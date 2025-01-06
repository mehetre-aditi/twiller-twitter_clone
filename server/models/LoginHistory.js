const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    browser: { type: String },
    os: { type: String },
    device: { type: String },
    ip: { type: String },
    location: { type: Object },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LoginHistory', loginHistorySchema);
