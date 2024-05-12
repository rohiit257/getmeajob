import {Router} from 'express'
import { isAuthenticated } from '../middlewares/auth.js'
import { getJobById, getallJobs, getmyJobs, postJob, updateJob } from '../controllers/job.controller.js'

const router = Router()


router.route("/getalljobs").get(getallJobs)
router.route("/postjob").post(isAuthenticated,postJob)
router.route("/getmyjobs").get(isAuthenticated,getmyJobs)
router.route("/update/:id").put(isAuthenticated,updateJob)
router.route("/getajob/:id").get(isAuthenticated,getJobById)

export default router