import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


// const SubDomain = new mongoose.Schema({
//     target : {
//         type: String,
//     },
//     subdomainlist :{
//         type : String,

//     }
// });



const UserSchema  =  new mongoose.Schema({
    username : {
        type : String,
        required : [true, "Please provide username"]
    },
    email : {
        type : String,
        required : [true, "Please provide email"],
        unique : true,
        match : [
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
        , "Please Provide valid email",
    ],
    },
    password : {
        type : String,
        required : [true, "Please provide password"],
        minlength : 6,
        select : false
    },
    resetPasswordToken: String,
    resetPasswordExpire : Date,
    SubDomain:[{
            target : {type: String},
            subdomainlist :{type : String}
        }]
    // SubDomain : {
    //     target : {type: String},
    //     subdomainlist :{type : String}
    // }  
});

// run before schema , this is middleware that is run brfore data get saved and hash our password
UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
});


UserSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getSignedToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRE,
    });
}

UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.getResetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire =  Date.now() + 10 * (60 * 1000);
    return resetToken;

}
const User = mongoose.model("User",UserSchema);
//const User = mongoose.model.apply("User",UserSchema);

export default User;