import { throws } from 'assert';
import child_process from 'child_process';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';


export const HomeScreen = async (req,res,next) =>{
    const {target} = req.body;
    var largeDataSet = new Set();
    let token;
    try {
            const spawn = child_process.spawn;
            // const pythonProcess =  spawn('python',["../Python_Script/SubDomain.py",target]);
            // pythonProcess.stdout.on('data', function (data) {
            //     console.log('Pipe data from python script ...')
            //     //dataToSend =  data;
            //     res.send(data.toString())
            //     largeDataSet.push(data)
            //   })
            
            const subprocess = runScript();
            subprocess.stdout.on('data',async (data) => {
                console.log(`data:${data}`);
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
                    user.SubDomain.target = target;
                    user.SubDomain.subdomainlist = data.toString();
                    user.save();
                    
                    
                }catch{
                    return next(new ErrorResponse("Not authorised to acces this route", 401));
                }

             });
             subprocess.stderr.on('data', (data) => {
                console.log(`error:${data}`);
             });
             subprocess.stderr.on('close', () => {
                console.log("Closed");
             }); 
            
            
            // pythonProcess.on('close', function(code){
            //     console.log(`child process close all stdio with code ${code}`);
            //     // console.log(largeDataSet);
            //     // send data to browser
            //     // res.send(largeDataSet.toSting())  
            //     res.status(200).json({
            //         success: true,
            //         data: ress.toString(),
            //     });
            // });


            function runScript(){
                return spawn('python3',[`Python_Script/SubDomain.py`,target]);
            }
           
    } catch (error) {
        res.status(400).json({
            success: false,
            data: error.toString(),
        });
    }
    // res.status(200).json({
    //     success: true,
    //     data: "You got accesss to the private data in this route",
    // });
    
};
