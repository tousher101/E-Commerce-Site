const JWT_SECRET_KEY=process.env.JWT_LOGIN_SECRATE
const jwt=require('jsonwebtoken');


const verification=(req,res,next)=>{
   
    const token=req.cookies.token
    if(!token){return res.status(401).json({msg:'Access Not Allowed'})}
    try{
        const decode = jwt.verify(token,JWT_SECRET_KEY)
        req.user=decode
        next();

    }catch(err){console.error(err); res.status(403).json({msg:'Invalid Token'})}
}

module.exports=verification