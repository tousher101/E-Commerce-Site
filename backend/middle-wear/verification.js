const ACCESS_TOKEN_SECRATE=process.env.JWT_ACCESS_SECRATE
const jwt=require('jsonwebtoken');


const verification=(req,res,next)=>{
   try{
        const authHeader= req.headers["authorization"];
        const token= authHeader?.split(" ")[1];
        if(!token){return res.status(401).json({msg:'Access Not Granted'})}
        const decode = jwt.verify(token,ACCESS_TOKEN_SECRATE)
        req.user=decode
        next();

    }catch(err){console.error(err); res.status(403).json({msg:'Invalid Token'})}
}

module.exports=verification