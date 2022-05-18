import express from "express";
import { acceptRequest, sendRequest ,seeRequests, rejectRequest ,unfriendUser,blockUser} from "../controller";
import { verifyToken } from "../middleware";
import { validateId } from "../validition/uservalidition";
const router = express.Router();

router.route("/:id")
.post(validateId,verifyToken,sendRequest)

router.get("/",verifyToken,seeRequests)
router.post("/accept/:id",validateId,verifyToken,acceptRequest)
router.post("/reject/:id",validateId,verifyToken,rejectRequest)
router.post("/unfriend/:id",validateId,verifyToken,unfriendUser)
router.post("/block/:id",validateId,verifyToken,blockUser)
export default router
