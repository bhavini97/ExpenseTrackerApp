const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = (req,res,next)=>{
    try{
        const token = req.header('Authorization').split(" ")[1]; // Extract token from the request header
        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }
        const decoded = jwt.verify(token, SECRET_KEY); // extract the decoded user details
        req.user = decoded; // Attach user data to `req.user`
        next(); // move to next function

    }catch(err){
        res.status(401).json({ message: "Invalid Token" });
    }
}