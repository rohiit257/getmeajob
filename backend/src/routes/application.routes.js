import {Router} from 'express'
import { isAuthenticated } from '../middlewares/auth.js'
import { employerGetAllApplications, jobseekerDeleteApplication, jobseekerGetAllApplications, postApplication } from '../controllers/application.controller.js'

const router = Router()

router.route("/sendapplication").post(isAuthenticated,postApplication)
router.route("/employer/getall").get(isAuthenticated,employerGetAllApplications)
router.route("/jobseeker/getall").get(isAuthenticated,jobseekerGetAllApplications)
router.route("/jobseeker/delete/:id").delete(isAuthenticated,jobseekerDeleteApplication)

export default router