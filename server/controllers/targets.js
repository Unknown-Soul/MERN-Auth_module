import { throws } from 'assert';
import child_process from 'child_process';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js'


export const targets = async (req, res, next) => {
    console.log("reached here");

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    } else {
        console.log("error with token");
    }
    if (!token) {
        return next(new ErrorResponse("Not Authorized to Access this route"), 401);
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.id);
        if (!user) {
            return next(new ErrorResponse("No User Found with this Id", 404));
        }
        const targets_data = await user.SubDomain;
        // console.log(targets_data[3].target);
        res.status(200).json({
            success: true,
            data: targets_data,
        });
        // user.SubDomain.push(temp);

    //     // user.save();
    //     res.status(200).json({
    //         success: true,
    //         data: "Data Saved Successfully",
    //     });
    } catch (error) {
        console.log(error.toString());
        return next(new ErrorResponse("Not authorised to acces this route", 401));

    }


    


}
