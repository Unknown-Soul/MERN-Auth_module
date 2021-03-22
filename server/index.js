import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';


import  postRoutes  from './routes/routes.js';

const app = express();

app.use(express.json({limit: "30mb", extended: true}));
app.use(express.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use('/tododb', postRoutes);
// const poolSize : '10';
const dbURL = 'mongodb://127.0.0.1:27017/tododb';
const PORT = process.env.PORT|| 5000;


mongoose.connect(dbURL,{poolSize:10},(err) =>{
    if(err){
        console.log(err);
    }else{
        app.listen(PORT, () => console.log('listening'));
        console.log("conneciton created");
    }
}); //inbuilt function

//mongoose.set('useFindandModify', false)