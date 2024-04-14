const superAdminAuthorization=(req,res,next)=>{
    if(req.user.role==="SuperAdmin"){
        next();
    }
    else{
        res.status(403).json({error:"Available for superAdmin Only"})
    }
}
module.exports={
    superAdminAuthorization,
}