const { getAllManagers, createLeaveReq, getLeaveRequestsForEmployee, updateLeaveRequestStatus, deleteLeaveRequest } = require("../repositories/leaveServices")

const getManagerController  = async (req,res) => {
    try {
        const manager = await getAllManagers()
        res.status(200).json(manager)
    } catch (error) {
        res.status(500).json({
            success:false,
            error
        })
        console.log(error)
    }
}

const createLeaveReqController  = async (req,res) => {
    try {
        const leaveReq = req.body
        console.log(leaveReq)
        leaveReq.Status = "Pending"
        const createdLeaveReq = await createLeaveReq(leaveReq)
        res.status(201).json({
            success:true,
            LeaveRequest:createdLeaveReq
        })
    } catch (error) {
        res.status(409).json({
            success:false,
            error
        })
        console.log(error)
    }
}

const getLeaveReqController  = async (req,res) => {
    const {userId} = req.body
        console.log(userId)
    try {
        const leaveReequests = await getLeaveRequestsForEmployee(userId)
        res.status(201).json({
            leaveReequests
        })
    } catch (error) {
        res.status(401).json({
            success:false,
            error
        })
        console.log(error)
    }
}

const updateStatuesLeaveReqController = async (req,res) =>{
    const id = req.params.id
    const {Status} = req.body
    console.log(Status,id)
    try {
        const updatedReq = updateLeaveRequestStatus(id,Status)
        res.status(200).json(updatedReq)
    } catch (error) {
        res.json({error})
    }
}

const deleteLeaveReqController = async (req,res) =>{
    const id = req.params.id
    try {
        const updatedReq = deleteLeaveRequest(id)
        res.status(200).json(updatedReq)
    } catch (error) {
        res.json({error})
    }
}



module.exports = {
    getManagerController,
    createLeaveReqController,
    getLeaveReqController,
    updateStatuesLeaveReqController,
    deleteLeaveReqController
}