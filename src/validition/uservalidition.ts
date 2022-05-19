import * as joi from "joi";
import { NextFunction, Request, Response } from "express";
import { validateBody } from "../middleware";
import { validate as UUIDValidate } from 'uuid';

export const taskValidition = (req: Request, res: Response, next: NextFunction) => {
    const schema: any = joi.object({
        title: joi.string().trim().max(30).required(),
        description: joi.string().max(70).trim().required()
    })
    validateBody(schema, req, res, next)
}
export const userValidition = (req: Request, res: Response, next: NextFunction) => {
    const schema: any = joi.object({
        fullName: joi.string().trim(),
        email: joi.string().email().trim().required(),
        password: joi.string().min(6).max(15).trim().required()
    })
    validateBody(schema, req, res, next)
}

export const validateId = (req: any, res: Response, next: NextFunction) => {
    let { id }: { id: any } = req.params;
    const validId = UUIDValidate(id)
    if (!validId) {
        return res.status(409).json({
            statusCode: 409, message: "enter valid id"
        })
    }
    req.params.id = id
    return next()

} 
