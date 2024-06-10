import express from "express"
import {sendMessage} from "../controllers/sendMessage.controller.js"
import {getMessage} from "../controllers/getMessage.controller.js"
import protectRoute from "../middleware/protectRoute.js"
const router = express.Router();

router.get("/:id",protectRoute,getMessage)
router.post("/send/:id",protectRoute,sendMessage)

export default router