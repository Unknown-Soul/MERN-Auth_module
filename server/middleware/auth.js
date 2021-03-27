import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';


export const protect =  async (req,res, next) => {
    let token;

    if(req.headers.authorization &&  req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1]
    }
    if(!token){
        return next(new ErrorResponse("Not Authorized to Access this route"),401);
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.id);
        if(!user){
            return next(new ErrorResponse("No User Found with this Id",404));
        }

        req.user = user;
        next();
    }catch{
        return next(new ErrorResponse("Not authorised to acces this route", 401));
    }
};