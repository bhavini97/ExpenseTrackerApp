const express = require("express");
const router = express.Router();
const premium = require('../controller/premiumFeature');
const path = require('path')
const authMiddleware = require('../middleware/jwt')


router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"..","public","premium.html"))
})
router.get("/expenses",authMiddleware,premium.getTable)

router.get('/leaderboard', authMiddleware, premium.getLeaderboard);
router.get('/auth/user-details',authMiddleware,premium.getUserDetails);
router.get('/downloads',authMiddleware,premium.getDownloadFiles);
module.exports = router;
