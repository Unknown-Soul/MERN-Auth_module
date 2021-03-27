import mongoose from 'mongoose';

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true
    }, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("conneciton created");
        }
    });


}

export default connectDB;