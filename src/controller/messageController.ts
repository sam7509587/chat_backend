import { Response, NextFunction } from "express";
import { ApiError } from "../config";
const { User, Message, Friend } = require("../db/models");
import * as Sequelize from "sequelize";
const Op: any = Sequelize.Op;

export const sendMessage = async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { message } = req.body;
    try {
        if (id === req.user.id) {
            return next(new ApiError(401, `sender and receiver ids are same`));
        }
        if (!message) {
            return next(new ApiError(401, `message is required`));
        }
        const foundData = await User.findOne({ where: { id } })
        if (!foundData) {
            return next(new ApiError(401, `no user found with this ${id}`));
        }
        const ids = [id, req.user.id]
        const requestFound = await Friend.findOne({
            where: {status:"accepted",
                sender: { [Op.or]: ids },
                receiver: { [Op.or]: ids }
            }
        });
        if (!requestFound) {
            return next(new ApiError(400, "you are not friends"))
        }
        const messageSent = await Message.create({ to: id, from: req.user.id, message, conversationId: requestFound.id })
        return res.status(200).json({
            statusCode: 200, message: "Message sent", data: messageSent
        })
    } catch (err: any) {
        return next(new ApiError(400, err.message))
    }
}
export const deleteMessage = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user
        const findMessage = await Message.findOne({ where: { id } });
        if (!findMessage || findMessage.deletedBy.includes(userId)) {
            return next(new ApiError(401, `no msg found with this ${id}`));
        }
        const ids = findMessage.deletedBy;
        ids.push(userId)
        await Message.update({ isDeleted: true, deletedBy: ids }, { where: { id } });
        return res.status(200).json({
            statusCode: 200, message: "message deleted successfully"
        })
    } catch (err: any) {
        return next(new ApiError(400, err.message))
    }
}
export const clearMessage = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { id: userId } = req.user
        const ids = [userId, id]
        const findMessages = await Message.findAll({
            where: {
                to: { [Op.or]: ids },
                from: { [Op.or]: ids }
            }
        })
        for (let i of findMessages){
            const ids = i.deletedBy;
        ids.push(userId)
        await Message.update({ isDeleted: true, deletedBy: ids }, { where: {
            to: { [Op.or]: ids },
            from: { [Op.or]: ids }
        }});
        }
        if (!findMessages ) {
            return next(new ApiError(400, `no messages with this user found`))

        }
        return res.status(200).json({ statusCode: 200, message: "all messages are deleted" })
    } catch (err: any) {
        console.log(err)
        return next(new ApiError(400, err.message))
    }
}
export const showMessage = async (req: any, res: Response, next: NextFunction) => {
    try {
        let { search = "",page =1 ,limit =10} = req.query;
        const { id } = req.user
        const { id: senderId } = req.params;
        const ids = [id, senderId]
        const data = await Message.findAll({
            where: {
                to: { [Op.or]: ids }, message: { [Op.iLike]: `%${search}%` },
                from: { [Op.or]: ids }
            },order: [
                ['createdAt', 'ASC'],
            ],limit : ((page)*limit),
            attributes: ["to", "from", "createdAt", "message", "isRead","deletedBy" ,"id"], include: [{
                model: User,
                as: "sender", attributes: ["fullName","id"] 
            }, {
                model: User,
                as: "receiver", attributes: ["fullName" ,"id"]
            }],
        })
        if (!data) {
            return next(new ApiError(200, `there is no messages from that ${id}`))
        }
        const messagesFound = data.filter((message) => {
            console.log(message)
            return !message.deletedBy?.includes(id)
        })
        const findUnreadMsg = data.filter((message) => {
            return (message.isRead === false && message.to === id);
        }).map((ids) => {
            return ids.id
        })
        await Message.update({ isRead: true }, { where: { id: findUnreadMsg } })
        return res.status(200).json({ statusCode: 200, message: "users found", data:messagesFound })
    } catch (err: any) {
        console.log(err)
        return next(new ApiError(400, err.message))
    }
}
