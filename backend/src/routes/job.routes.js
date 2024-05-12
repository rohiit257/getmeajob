import {Router} from 'express'
import { isAuthenticated } from '../middlewares/auth.js'
import { postJob } from '../controllers/job.controller.js'

const router = Router()

router.route("/postjob").post(isAuthenticated,postJob)

export default router