import express from 'express';
import User from '../models/User.js'

const router = express.Router();

export const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({
            username, email, password
        });
        res.status(201).json({
            success: true,
            user    //sending back user informations 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};


export const login = async (req, res, next) => {
    // res.send("Login");
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ 
            success: false, 
            error: "Please Enter Email and Password" 
        });
    }
    try {
        const user = await User.findOne({email}).select("+password");
        if(!user){
            res.status(404).json({ success: false, error: "Invalid User" })
        }
        const isMatch =  await user.matchPasswords(password);
        
        if(!isMatch){
            res.status(404).json({ success: false, error: "Invalid User" })
        }

        res.status(200).json({
            success : true,
            token : "122121",
        });
    } catch (error) {
        res.status(404).json({status: false , error : "Invalid Credentials"});
    }
};

export const forgotpassword = (req, res, next) => {
    res.send("ForgotPassword");
};

export const resetpassword = (req, res, next) => {
    res.send("ResetPassword");
};

export default router;