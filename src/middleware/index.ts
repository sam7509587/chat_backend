import * as jwt from "jsonwebtoken"
import { NextFunction, Request,Response } from "express";
import { ApiError, SECRET_KEY } from "../config";
const { User } = require("../db/models")

export const validateBody = (schema:any,req:Request,res:Response,next:NextFunction)=>{
    const result = schema.validate(req.body);
    if(result.error){
       const errorMsg =  result.error.details[0].message.replace(/[^a-zA-Z0-9 ]/g, "")
        res.status(409).json({
            statusCode :409,message:errorMsg
        })
    }
    else{
        next()
    }
}
export const verifyToken = async (req: any, res: Response, next: NextFunction) => {
    const token: any = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(409).json({
            statusCode: 409, message: "token is required"
        })
    }else{
        return await jwt.verify(token, SECRET_KEY, async(err: any, result: any) => {
             if (err) {
                 return next(new ApiError(409,err.message))
             }else{
                 const id: string = result.id
                 const userFound = await User.findOne({where:{id}});
                 if(!userFound){
                     return next(new ApiError(400,"no user found with this token"))
                 }
                 req.user = userFound
                 next()
             }
         })
    }
}
