const { getTodayAttendaceOfEmplyoee, updateTodayAttendaceOfEmplyoee, getTodayAttendaceOfEmplyoeesByStatus, getAttendaceOfEmplyoeesByDate, getWeeklySummaryByDay } = require("../repositories/attendanceService")


async function GetAttenForEmpController(req, res) {
    const id = req.params.id
    console.log(id)
    try {
        const result = await getTodayAttendaceOfEmplyoee(id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
        console.log(error)
    }
}

async function updateAttenForEmpController(req, res) {
    const id = req.params.id
    const { status } = req.body
    console.log(id, status)
    try {
        const result = await updateTodayAttendaceOfEmplyoee(id, status)
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
        console.log(error)
    }
}

async function GetAttenForEmpByStatusController(req, res) {
    const status = req.params.status
    console.log(status)
    try {
        if (status === "All") {
            const result = await getAttendaceOfEmplyoeesByDate()
            res.status(200).json(result)
            return
        }
        const result = await getTodayAttendaceOfEmplyoeesByStatus(status)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
        console.log(error)
    }
}

async function GetAttenDetailsWeek(req, res) {
    try {
        const result = await getWeeklySummaryByDay()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
        console.log(error)
    }
}



module.exports = {GetAttenDetailsWeek, GetAttenForEmpController, updateAttenForEmpController, GetAttenForEmpByStatusController }