const express = require("express");
const router = express.Router();
const forgetPassword = require('../controller/forgetPassword');


router.post('/forgotpassword',forgetPassword.sendEmail);
router.get('/resetpassword/:id',forgetPassword.getResetForm);
router.post("/updatepassword/:id",forgetPassword.updatePassword);


module.exports = router;
