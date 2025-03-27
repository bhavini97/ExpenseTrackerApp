const express = require("express");
const router = express.Router();
const leadershipCtrl = require('../controller/leadershipCtrl');
const path = require("path");
const authMiddleware = require('../middleware/jwt')

router.get('/leaderboard', authMiddleware, leadershipCtrl.getLeaderboard);
router.get('/auth/user-details',authMiddleware,leadershipCtrl.getUserDetails);

module.exports = router;