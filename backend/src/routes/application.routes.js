import {Router} from 'express'
import { isAuthenticated } from '../middlewares/auth.js'
import { postApplication } from '../controllers/application.controller.js'

const router = Router()

router.route("/sendapplication").post(isAuthenticated,postApplication)

export default router