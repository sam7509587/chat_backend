import { Request, Response, NextFunction } from "express";
import { ApiError, SECRET_KEY } from "../config";
import * as Sequelize from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../utility/mail";
const { User, Friend } = require("../db/models")
import { v4 as UUID } from "uuid";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, fullName } = req.body;
    try {
        const foundUser = await User.findOne({ where: { email } })
        if (!foundUser) {
            if (!fullName) {
                return next(new ApiError(401, "fullName is required"))
            }
            const bcryptPass = await bcrypt.hash(password, 10)
            const otp = Math.floor(100000 + Math.random() * 900000);
            const otpExp = new Date(new Date().getTime() + 5 * 60000);
            await User.create({ id: UUID(), email, otpExp, password: bcryptPass, fullName, otp })
            await sendMail(email, otp)
            return res.status(200).json({
                statusCode: 200, message: "signup successfull check mail to verify otp valid fro 5 mins",
            })
        } else {
            const token = await jwt.sign({ id: foundUser.id }, SECRET_KEY)
            if (foundUser.isVerified === false) {
                if (foundUser.otpExp > Date.now()) {
                    const timeLeft = (((foundUser.otpExp - Date.now()) / 60000).toFixed(2)).replace(/\./g,':')
                    return next(new ApiError(403, `${timeLeft} time left verify your otp to login`))
                }
                const otp = Math.floor(100000 + Math.random() * 900000);
                const otpExp = new Date(new Date().getTime() + 5 * 60000);
                await sendMail(email, otp)
                await User.update({ otpExp, otp }, { where: { email } })
                return res.status(200).json({
                    statusCode: 200, message: "verify mail to login by otp sent on your mail",
                })
            }
            const comparedPass = await bcrypt.compare(password, foundUser.dataValues.password)
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
        const { email, otp, ...other }: any = req.body
        if (!email || !otp) {
            return next(new ApiError(400, "email and otp are required"))
        }
        if (Object.entries(other).length > 0) {
            return next(new ApiError(400,`${other} fields are not allowed}`))
        }
        const foundData = await User.findOne({ where: { email } })
        if (!foundData) {
            return next(new ApiError(400, "no user found with this email"))
        }
        if(foundData.isVerified === true){
            return next(new ApiError(400,"already verified user"))
        }
        if (foundData.otp != otp) {
            return next(new ApiError(400, "invalid otp"))
        }
        if(foundData.otpExp<Date.now()){
            return next(new ApiError(400,"otp expired"))
        }
        await User.update({isVerified: true},{ where: { email } })
        const token = await jwt.sign({ id: foundData.id }, SECRET_KEY)
        return res.status(200).json({
            statusCode: 200, message: "login successfull !!", token
        })
    } catch (err: any) {
        return next(new ApiError(400, err.message))
    }
}
