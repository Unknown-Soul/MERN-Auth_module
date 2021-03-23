import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    resetPasswordExpire : Date
});

// run before schema
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

const User = mongoose.model("User",UserSchema);
//const User = mongoose.model.apply("User",UserSchema);
export default User;