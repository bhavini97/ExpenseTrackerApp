const express = require("express");
const router = express.Router();
const loginSignUpCtrl = require('../controller/signupLogin');
const path = require("path");
const authMiddleware = require('../middleware/jwt')

router.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname, "..", "public", "form.html"));
})

router.post('/user/signup',loginSignUpCtrl.addUser);

router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, "..", "public", "login.html"));
})

router.post('/user/login',loginSignUpCtrl.loginUser);

router.get('/user-details',authMiddleware,loginSignUpCtrl.getUserDetails);

module.exports = router;