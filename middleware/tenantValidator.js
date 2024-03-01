const tenantValidator=(req,res,next)=>{
    if(req.user.role==="tenant"){
        next();
    }
    else{
        res.status(403).json({error:"Available for Tenant Only"})
    }
}
module.exports={
    tenantValidator,
}