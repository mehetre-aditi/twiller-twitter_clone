// const express = require('express');
// const router = express.Router();
// const useragent = require('useragent');
// const geoip = require('geoip-lite');
// const { authenticateUser } = require('../middlewares/authMiddleware');
// const { saveLoginHistory } = require('../services/loginHistoryService');

// // Login route
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     // Detect user agent details
//     const agent = useragent.parse(req.headers['user-agent']);
//     const deviceType = agent.device.family;
//     const os = agent.os.family;
//     const browser = agent.toAgent();

//     // Get IP address
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//     // Check if the user is using Microsoft browser
//     if (browser.toLowerCase().includes('microsoft')) {
//         // Allow access without authentication
//         return res.status(200).json({ message: 'Logged in successfully without authentication', browser });
//     }

//     // Check if the user is on a mobile device
//     const isMobile = /mobile/i.test(deviceType);
//     const currentTime = new Date().getHours();

//     if (isMobile && (currentTime < 10 || currentTime >= 13)) {
//         return res.status(403).json({ message: 'Access is restricted to 10 AM - 1 PM on mobile devices' });
//     }

//     // Authenticate user
//     const user = await authenticateUser(email, password);
//     if (!user) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Save login history to the database
//     const location = geoip.lookup(ip);
//     const loginDetails = {
//         userId: user._id,
//         browser,
//         os,
//         device: deviceType,
//         ip,
//         location,
//         timestamp: new Date(),
//     };

//     await saveLoginHistory(loginDetails);

//     res.status(200).json({ message: 'Logged in successfully', user });
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const useragent = require('useragent');
const geoip = require('geoip-lite');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { saveLoginHistory, getLoginHistory } = require('../services/loginHistoryService'); // Updated to include getLoginHistory

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Detect user agent details
    const agent = useragent.parse(req.headers['user-agent']);
    const deviceType = agent.device.family;
    const os = agent.os.family;
    const browser = agent.toAgent();

    // Get IP address
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Check if the user is using Microsoft browser
    if (browser.toLowerCase().includes('microsoft')) {
        // Allow access without authentication
        return res.status(200).json({ message: 'Logged in successfully without authentication', browser });
    }

    // Check if the user is on a mobile device
    const isMobile = /mobile/i.test(deviceType);
    const currentTime = new Date().getHours();

    if (isMobile && (currentTime < 10 || currentTime >= 13)) {
        return res.status(403).json({ message: 'Access is restricted to 10 AM - 1 PM on mobile devices' });
    }

    // Authenticate user
    const user = await authenticateUser(email, password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Save login history to the database
    const location = geoip.lookup(ip);
    const loginDetails = {
        userId: user._id,
        browser,
        os,
        device: deviceType,
        ip,
        location,
        timestamp: new Date(),
    };

    await saveLoginHistory(loginDetails);

    res.status(200).json({ message: 'Logged in successfully', user });
});

// GET route to fetch login history
router.get('/login-history', async (req, res) => {
    const { userId } = req.query;  
    
    try {
        const history = await getLoginHistory(userId);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching login history' });
    }
});

module.exports = router;
