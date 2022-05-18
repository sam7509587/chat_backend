import * as express from "express";
import userRoutes from "./userRoutes";
import googleRoutes from "./googleRoutes";
import friendRoutes from "./friendRoutes";
import messageRoutes from "./messageRoutes"
let router = express.Router();
router.use('/user',userRoutes);
router.use("/friend",friendRoutes)
router.use("/message",messageRoutes)
router.use("/",googleRoutes)
router.use("*",(_,res:any)=>{
    res.status(404).json({
        statusCode:404,message:"no route found"
    })
})
export = router;
