const express = require("express");
const router = express.Router();
const forgetPassword = require('../controller/forgetPassword');


router.post('/forgotpassword',forgetPassword);

module.exports = router;
