import express from "express";
const router = express.Router();
import {  getUser, login ,verifyOtp} from "../controller";
import { verifyToken } from "../middleware";
import {userValidition} from "../validition/uservalidition";
router.route("/")
.post(userValidition,login)
.get(verifyToken,getUser)

router.route("/verify")
.post(verifyOtp)
export default router
