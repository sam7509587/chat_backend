import {  Response, NextFunction } from "express";
import { ApiError } from "../config";
// const { User } = require("../db/models")
export const googleLogin =async (req: any, _: Response, next: NextFunction)=>{
    try {
        console.log(req.user)
        // const foundData = await User.findOne({ where: { email } })
        // if (!foundData) {
        //     const bcryptPass = await bcrypt.hash(password, 10)
        //     const data = await User.create({ email, password: bcryptPass })
        //     const token = await jwt.sign({ id: data.id }, SECRET_KEY)
        //     await sendMail(email)
        //     return res.status(200).json({
        //         statusCode: 200, message: "login successfull", token
        //     })
        // } else {
        //     const comparedPass = await bcrypt.compare(password, foundData.password)
        //     if (comparedPass != true)
        //         return next(new ApiError(401, "email or password in wrong"))
        // }
        // const token = await jwt.sign({ id: foundData.id }, SECRET_KEY)
        // return res.status(201).json({
        //     statusCode: 200, message: "login successfull", token
        // })
    } catch (err: any) {
        return next(new ApiError(400, err.message))
    }
}
