const cron = require("node-cron")
const { generateBulkDailyAttendance } = require("../repositories/attendanceService")


function dailyTask(){
    cron.schedule("0 0 * * *",generateBulkDailyAttendance)
}



module.exports  = dailyTask