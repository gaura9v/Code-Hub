const express=require("express");
const authRouter=express.Router();
const {register,login,logout,adminRegister,deleteProfile}=require("../controllers/userAuthent")
const userMiddleware=require("../middleware/userMiddleware");
const adminMiddleware=require("../middleware/adminMiddleware")

authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.post("/logout",userMiddleware,logout);
authRouter.post("/admin/register",adminMiddleware,adminRegister);//only admin will register admin , so we first check the user is admin or not (admin ko hi khud ko verify karna padega ki vo admin he ya nhi)
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
authRouter.get('/check',userMiddleware,(req,res)=>{
    const reply={
        firstName:req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id,
        role:req.result.role,
    }
    res.status(200).json({
        user:reply,
        message:"valid user"
    })
})
// authRouter.post("/getProfile",getProfile);

module.exports=authRouter;