import { Request, Response, NextFunction } from "express";
import { ApiError, SECRET_KEY } from "../config";
import * as Sequelize from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../utility/mail";
const { User, Friend } = require("../db/models")

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullName } = req.body;
    try {
        const foundData = await User.findOne({ where: { email } })
        if (!foundData) {
            if (!fullName) {
                return next(new ApiError(401, "fullName is required"))
            }
            const bcryptPass = await bcrypt.hash(password, 10)
            const otp = Math.floor(100000 + Math.random() * 900000);
            await User.create({ email, password: bcryptPass, fullName ,otp})
            
            await sendMail(email,otp)
            return res.status(200).json({
                statusCode: 200, message: "signup successfull check mail to verify otp",
            })
        } else {
            const token = await jwt.sign({ id: foundData.id }, SECRET_KEY)
            if (foundData.dataValues.password === null) {
                return res.status(201).json({
                    statusCode: 200, message: "login successfull", token
                })
            }
            const comparedPass = await bcrypt.compare(password, foundData.dataValues.password)
            if (comparedPass != true) {
                return next(new ApiError(401, "email or password in wrong"))
            }
            else {
                return res.status(201).json({
                    statusCode: 200, message: "login successfull", token
                })
            }
        }
    } catch (err: any) {
        return next(new ApiError(400, err.message))
    }
}
export const getUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        let { search = "" } = req.query

        const Op = Sequelize.Op
        const { id } = req.user
        const findBockedUsers = await Friend.findAll({ where: { [Op.or]: [{ sender: id }, { receiver: id }] } })
        let blockedIds;
        if (findBockedUsers) {
            const blockedUser = findBockedUsers?.filter((users) => users.status === "blocked")
                .map((ids) => {
                    const a: any = [];
                    if (ids.sender === id) {
                        a.push(ids.receiver)
                    }
                    if (ids.receiver === id) {
                        a.push(ids.sender)
                    }
                    return a
                });
            blockedIds = blockedUser.flat(1)
            blockedIds.push(id)
        } else {
            blockedIds = [id]
        }
        console.log(blockedIds)
        const data = await User.findAll({
            where: {
                fullName: {
                    [Op.iLike]: `%${search}%`
                }, id: { [Op.notIn]: blockedIds }
            }
        })
        return res.status(200).json({ statusCode: 200, message: "users found", total: data.length, data })
    } catch (e: any) {
        console.log(e);
        return next(new ApiError(400, e.message))
    }
}
export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp ,...other}: any = req.body
        if (!email || !otp) {
            return next(new ApiError(400, "email and otp are required"))
        }
        if(Object.entries(other).length>0){
            return next(new ApiError(400, "only email and otp are required"))
        }
        const foundData = await User.findOne({ where: { email } })
        if (!foundData) {
            return next(new ApiError(400, "no user found with this email"))
        }
        if (foundData.otp != otp) {
            return next(new ApiError(400, "invalid otp"))
        }
        const token = await jwt.sign({ id: foundData.id }, SECRET_KEY)
        return res.status(200).json({
            statusCode: 200, message: "login successfull !!", token
        })
    } catch (err: any) {
        return next(new ApiError(400, err.message))
    }
}
