const express = require("express")
const app = express()


const authRoute = require("./route/auth.route")
const adminRoute = require("./route/admin.route")
const leaveRoute = require("./route/leaveReq.route")
const AttendanceRouter = require("./route/attendence.route")



const cors = require("cors")
const authorize = require("./middleware/role.middleware")
const taskRouter = require("./route/task.routes")
const authenticate = require("./middleware/auth.middleware")
const { getAllManagers,getLeaveRequestsForEmployee, getApprovedLeaveEmployeesByDate } = require("./repositories/leaveServices")
const { getAllLeaveRequestsForAdmin, getLeaveRequestsForManager } = require("./repositories/adminServices")
const { getTodayAttendaceOfEmplyoee, generateBulkDailyAttendance, getTodayAttendaceOfEmplyoeesByStatus, getWeeklySummaryByDay } = require("./repositories/attendanceService")
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "PATCH", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/auth", authRoute)

app.use("/task", authenticate, taskRouter)
app.use("/attendence", authenticate, AttendanceRouter)

app.use("/admin/api",
  authenticate,
  authorize("Admin", "Manager"),
  adminRoute)

app.use("/leaveRequest", authenticate,leaveRoute)

app.get("/test/testing", async (req, res) => {
  const hello = await generateBulkDailyAttendance()
  res.status(200).json(hello)
})

app.get("/test/hello", async (req, res) => {
  const hello = await getWeeklySummaryByDay()
  res.status(200).json(hello)
})




app.listen("8000")