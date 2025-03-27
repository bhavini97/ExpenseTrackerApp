require('dotenv').config();
const bcrypt = require('bcrypt');
const {User} = require('../models/centralized');
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY 

module.exports ={
    addUser :async(req,res)=>{
       const username = req.body.username;
       const email = req.body.email;
       const password = req.body.password;
       
       if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

       try{
        const hashedPassword = await bcrypt.hash(password, 10).catch(err => {
            console.error('Error hashing password:', err);
            return  res.status(501).json({ message: 'error hashing password' })
        });

        const [result, created] = await User.findOrCreate({ 
            where: { email: email },
            defaults:{username: username,password:hashedPassword,email:email }
       });

        if(!created){
            return  res.status(400).json({ message: 'User already exists with the same email' });
        }

        
        return res.status(201).json({ message: 'User created successfully', user: result });

       }catch(err){
         console.error('error while entering user data in table',err);
         return res.status(500).json({ message: 'Internal Server Error', error: err });
       }
    },

    loginUser : async(req,res)=>{

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        try {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            
            const matchPassword = await bcrypt.compare(password, user.password).catch(err => {
                console.error('Error comparing hash password:', err);
                return  res.status(501).json({ message:'Something went wrong.Failed to compare hash password'});
            });;

            if (!matchPassword) {
                return res.status(401).json({ message: "Invalid password" });
            }
            
            //*IMPORTANT  generating token to send it to frontend*/
            const token = jwt.sign({
                userId : user.id
            },SECRET_KEY);
           return res.status(200).json({ message: "Login successful",token});// token send in response

        } catch (error) {
            console.error(" Error logging in:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    
};