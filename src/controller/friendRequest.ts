import { Response, NextFunction } from "express";
import { ApiError } from "../config";
import * as Sequelize from "sequelize";
import {v4 as UUID} from "uuid";
const Op = Sequelize.Op;
const { User, Conversation } = require("../db/models");

export const sendRequest = async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { id: userId } = req.user
    try {
        if (userId === id) {
            return next(new ApiError(400, "sender and receiver ids can't be same"))
        }
        const foundData = await User.findOne({ where: { id } })
        if (!foundData) {
            return next(new ApiError(401, `no user found with this ${id}`))
        }
        const ids = [id, userId]
        const findConversaton = await Conversation.findOne({
            where: {
                sender: { [Op.or]: ids },
                receiver: { [Op.or]: ids }
            }
        });
        if (findConversaton) {
            if (findConversaton.status === "blocked") {
                return next(new ApiError(400, `you can't send request to this user ${id} ,request has been blocked`))
            }
            if (findConversaton.status === "accepted") {
                return next(new ApiError(400, `user is already a friend with ${id}`))
            }
            if (findConversaton.status === "pending" && findConversaton.sender === id) {
                return next(new ApiError(400, `you already have a request from ${id} accept the request`))
            }
            if (findConversaton.status === "pending" && findConversaton.sender === req.user.id) {
                return next(new ApiError(400, "already sent request"))
            }
            const requestSent = await Conversation.update({ sender: userId, receiver: id })
            return res.status(200).json({
                statusCode: 200, message: "request sent", requestSent
            })
        }
        const requestSent = await Conversation.create({ id:UUID(),sender: userId, receiver: id })
        return res.status(200).json({
            statusCode: 200, message: "request sent", requestSent
        })
    } catch (err: any) {
        return next(new ApiError(400, err.message))
    }
}
export const acceptRequest = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const foundData = await User.findOne({ where: { id } })
        if (!foundData) {
            return next(new ApiError(401, "no user found with this id"))
        }
        const requestFound = await Conversation.findOne({ where: { sender: id, receiver: req.user.id ,status:"pending"} });
        if (!requestFound) {
            return next(new ApiError(400, `there is no request from ${id}`))
        }
        await Conversation.update({ status: "accepted" }, { where: { sender: id, receiver: req.user.id } })
        return res.status(200).json({
            statusCode: 200, message: "request accepted"
        })
    } catch (err: any) {
        console.log(err)
        next(new ApiError(400, err.message))
    }
}
export const rejectRequest = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const foundUser = await User.findOne({ where: { id } })
        if (!foundUser) {
            return next(new ApiError(401, "no user found with this id"))
        }
        const requestFound = await Conversation.findOne({ where: { sender: id, receiver: req.user.id ,status:"pending"} });
        if (!requestFound) {
            return next(new ApiError(400, `there is no request from ${id}`))
        }
        await Conversation.destroy({
            where: {
                sender: id, receiver: req.user.id
            }
        });
        return res.status(200).json({
            statusCode: 200, message: "request rejected"
        })
    } catch (err: any) {
        return next(new ApiError(400, err.message))
    }
}
export const seeRequests = async (req: any, res: Response, next: NextFunction) => {
    try {
        let { search = "" } = req.query
        const id = req.user.id;
        
        const data = await Conversation.findAll({
            where: {
                receiver: id,
                status: "pending"
            }, include: [{
                model: User,
                as: "sentFrom", where: { 'fullName': { [Op.iLike]: `%${search}%` } },
                attributes: ["fullName","id"]
            }]
        })
        return res.status(200).json({ statusCode: 200, message: "users found", data })
    } catch (err: any) {
        return next(new ApiError(400, err.message))
    }
}
export const unfriendUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const foundData = await User.findOne({ where: { id } })
        if (!foundData) {
            return next(new ApiError(401, "no user found with this id"))
        }
        const ids = [id,req.user.is]
        const requestFound = await Conversation.findOne({
            where: {
                sender: { [Op.or]: ids },
                receiver: { [Op.or]: ids }
            }
        });
        if (!requestFound) {
            return next(new ApiError(400, `you are not friend with ${id}`))
        }
        if (requestFound.status != "accepted") {
            return next(new ApiError(400, "you can't unfriend user when you are not friend with"));
        }
        await Conversation.destroy({
            where: {
                sender: id, receiver: req.user.id
            }
        })
        return res.status(200).json({
            statusCode: 200, message: "unfriend successfully"
        })
    } catch (err: any) {
        return next(new ApiError(400, err.message))
    }
}
export const blockUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const foundData = await User.findOne({ where: { id } })
        if (!foundData) {
            return next(new ApiError(401, "no user found with this id"))
        }
        const requestFound = await Conversation.findOne({ where: { sender: { [Op.or]: [id, req.user.id] }, receiver: { [Op.or]: [id, req.user.id] } } });
        if (!requestFound) {
            await Conversation.create({ sender: req.user.id, receiver: id, status: "blocked" })
            return res.status(200).json({
                statusCode: 200, message: "blocked successfully"
            })
        }
        if (requestFound.status === "blocked") {
            return next(new ApiError(409, "already blocked"))
        }
        await Conversation.update({ status: "blocked" }, { where: { [Op.or]: [id, req.user.id] }, receiver: { [Op.or]: [id, req.user.id] } })
        return res.status(200).json({
            statusCode: 200, message: "blocked successfully"
        })
    } catch (err: any) {
        return next(new ApiError(400, err.message))
    }
}
