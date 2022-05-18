import express from "express";
import { sendMessage ,deleteMessage, clearMessage, showMessage} from "../controller";
import { verifyToken } from "../middleware";
import { validateId } from "../validition/uservalidition";
const router = express.Router();

router.route("/:id")
.post(validateId,verifyToken,sendMessage)
.delete(verifyToken,validateId,deleteMessage)
.get(verifyToken,validateId,showMessage)
.patch(verifyToken,validateId,clearMessage)
export default router
