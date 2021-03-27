export const getPrivateData = (req,res,next) =>{
    
    res.status(200).json({
        success: true,
        data: "You got accesss to the private data in this route",
    });
};