import dotenv from 'dotenv';
dotenv.config({ path: "./config.env" });
import express from 'express';
import cors from 'cors';
import routerauth from './routes/auth.js';
import privateauth from './routes/private.js';
import connectDB from './config/db.js';
import errorHandler from './middleware/error.js';
const app = express();

app.use(express.json({limit: "30mb", extended: true}));
app.use(express.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

connectDB();
app.use('/api/auth', routerauth);
app.use('/api/private', privateauth);


// const dbURL = 'mongodb://127.0.0.1:27017/tododb';
// const PORT = process.env.PORT|| 5000;
// mongoose.connect(dbURL,{ useNewUrlParser: true, useUnifiedTopology: true },{poolSize:10},(err) =>{
//     if(err){
//         console.log(err);
//     }else{
//         app.listen(PORT, () => console.log('listening'));
//         console.log("conneciton created");
//     }
// }); 
// mongoose.set('useFindAndModify', false);
app.use(errorHandler);
const PORT  = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`server running on port ${PORT}`));

process.on("unhandledRejection",(err, promise) => {
    console.log(`Logged Error", ${err}`);
    // server.close(() => process.exit(1));
})