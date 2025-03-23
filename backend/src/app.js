import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(
    cors({
      origin:'http://localhost:3000',
      method: ["GET", "POST", "DELETE", "PUT"],
      credentials: true,
    })
  );

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from "./routes/user.routes.js"
import jobRouter from "./routes/job.routes.js"
import applicationRouter from "./routes/application.routes.js"

app.use("/api/v1/user",userRouter)
app.use("/api/v1/jobs",jobRouter)
app.use("/api/v1/application",applicationRouter)

export {app}