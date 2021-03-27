import express from 'express';
import User from '../models/User.js'
import ErrorResponse from '../utils/errorResponse.js'
import sendEmail from '../utils/sendEmail.js'
import crypto from 'crypto'

const router = express.Router();

export const register = async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({
            username, email, password
        });
        // res.status(201).json({   success: true,  token: "3321312sda"    //sending back user informations });
        sendToken(user, 201, res);
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
        // res.status(400).json({ success: false, error: "Please Enter Email and Password" });
        return next(new ErrorResponse("User Or Password Not Given", 400));
    }
    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorResponse("Invalid Credentials", 401));
        }
        const isMatch = await user.matchPasswords(password);

        if (!isMatch) {
            return next(new ErrorResponse("Invalid Credentials", 401));
        }

        // res.status(200).json({
        //     success : true,
        //     token : "122121",
        // });
        sendToken(user, 200, res);
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });

    }
};

export const forgotpassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("Email cpuld not be found", 404))
        }
        const resetToken = user.getResetPasswordToken();
        await user.save();
        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;
        const message = `<h1>Hree is you password reset link</h1> 
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`

        try {
                await sendEmail({
                    to: user.email,
                    subject : "Password reset",
                    text: message
                });

                res.status(200).json({success: trye, data: "Email sent"});
        } catch (error) {
                user,getResetPasswordToken = undefined;
                user.getResetPasswordToken = undefined;

                await user.save();
                return next(new ErrorResponse("Email Could not be Send",500));
        }
    } catch {
        next(error);
    }
};

export const resetpassword = async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
    res.send("ResetPassword");
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetpasswordExpire : {$gt : Date.now()}
        })
        if(!user){
            return next(new ErrorResponse("Invalid Reset",400))
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordToken = undefined;

        await user.save();

        res.status(201).json({
            success:true,
            data : "Password reset Sucess"
        })
    } catch (error) {
        next(error)
    }
};




const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({ success: true, token })
}

export default router;