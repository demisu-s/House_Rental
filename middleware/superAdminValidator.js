const superAdminValidator=(req,res,next)=>{
    if(req.user.role==="admin"){
        next();
    }
    else{
        res.this.status(403).json({error:"Available for superAdmin Only"})
    }
}
module.exports={
    superAdminValidator,
}