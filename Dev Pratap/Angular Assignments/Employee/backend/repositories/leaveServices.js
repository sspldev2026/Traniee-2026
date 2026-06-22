const { User, Role, LeaveRequests, Attendance } = require('../module');
const { Op } = require('sequelize');


async function getAllManagers() {
  try {
    const managers = await User.findAll({
      include: [{
        model: Role,
        as: 'Roles',
        where: {
          RoleName: 'Manager'
        },
        attributes: []
      }],
      attributes: ['UserID', 'FullName', 'Email']
    });

    return managers;
  } catch (error) {
    console.error("Error fetching managers:", error);
    throw error;
  }
}

async function createLeaveReq(leaveReqestData) {
  try {
    const alredayRequest = await LeaveRequests.findOne({
      where: {
        UserId: leaveReqestData.UserId,
        Status: leaveReqestData.Status
      }
    })
    if (alredayRequest) {
      const error = new Error(`Alredy Requested`);
      error.statusCode = 400;
      throw error;
      return
    }

    const newreq = await LeaveRequests.create({
      userId: leaveReqestData.UserId,
      reason: leaveReqestData.Reason,
      managerId: leaveReqestData.ManagerId,
      startDate: new Date(leaveReqestData.StartDate),
      endDate: new Date(leaveReqestData.EndDate)
    })

    return newreq;
  } catch (error) {
    console.error("Error fetching managers:", error);
    throw error;
  }
}

async function getLeaveRequestsForEmployee(userId) {
  try {
    const records = await LeaveRequests.findAll({
      where: {
        userId: userId
      },
      include: [
        { model: User, as: 'Manager', attributes: ['FullName', 'Email'] }
      ],
      order: [['CreatedAt', 'DESC']]
    });
    return records;
  } catch (error) {
    console.error(`Employee Service Error - Fetching leaves for employee ${userId} failed:`, error);
    throw error;
  }
}

async function updateLeaveRequestStatus(leaveRequestId, newStatus) {
  const currentDate = new Date().toISOString().split('T')[0];
  try {
    const leaveRequest = await LeaveRequests.findOne({
      where: { LeaveRequestsID: leaveRequestId }
    });

    if (!leaveRequest) {
      const error = new Error(`Leave request with ID ${leaveRequestId} not found.`);
      error.statusCode = 404;
      throw error;
    }

    leaveRequest.Status = newStatus;

    if(leaveRequest.Status === "Approved"){
      const currentAttence = await Attendance.findOne({
        where:{
          UserId:leaveRequest.dataValues.userId,
          date:currentDate
        }
      })

      

      if(currentAttence != null){
        currentAttence.Status = "OnLeave"
        await currentAttence.save()
      }
    }

    if(leaveRequest.Status === "Reject"){
      const currentAttence = await Attendance.findOne({
        where:{
          UserId:leaveRequest.dataValues.userId,
          date:currentDate
        }
      })

      

      if(currentAttence != null){
        currentAttence.Status = "Absent"
        await currentAttence.save()
      }
    }

    await leaveRequest.save();

    return leaveRequest;
  } catch (error) {
    console.error(`Service Error - Updating leave request ${leaveRequestId} failed:`, error);
    throw error;
  }
}

async function deleteLeaveRequest(leaveRequestId) {
  try {
    const leaveRequest = await LeaveRequests.findOne({
      where: { LeaveRequestsID: leaveRequestId }
    });

    if (!leaveRequest) {
      const error = new Error(`Leave request with ID ${leaveRequestId} not found.`);
      error.statusCode = 404;
      throw error;
    }


    const destroyed = await leaveRequest.destroy();

    return destroyed;
  } catch (error) {
    console.error(`Service Error - Delete leave request ${leaveRequestId} failed:`, error);
    throw error;
  }
}


async function getApprovedLeaveEmployeesByDate(targetDate) {
  try {
    const dateToCheck = targetDate || new Date().toISOString().split('T')[0];

    const employeesOnLeave = await LeaveRequests.findAll({
      where: {
        Status: 'Approved',
        startDate: {
          [Op.lte]: dateToCheck
        },
        endDate: {
          [Op.gte]: dateToCheck
        }
      },
      include: [
        {
          model: User,
          as: 'Employee',
          attributes: ['UserID', 'FullName', 'Email']
        }
      ],
      order: [['CreatedAt', 'DESC']]
    });

    return employeesOnLeave;
  } catch (error) {
    console.error(`Service Error - Fetching approved leave employees for ${targetDate} failed:`, error);
    throw error;
  }
}









// async function getApprovedLeaveForEmployeeByDate(userId, targetDate) {
//   try {
//     // If no targetDate is supplied, default to today's date string (e.g., '2026-06-18')
//     const dateToCheck = targetDate || new Date().toISOString().split('T')[0];

//     const approvedLeave = await LeaveRequests.findOne({
//       where: {
//         userId: userId,
//         Status: 'Approved',
//         // Logic: StartDate <= targetDate <= EndDate
//         startDate: { 
//           [Op.lte]: dateToCheck 
//         },
//         endDate: { 
//           [Op.gte]: dateToCheck 
//         }
//       }
//     });

//     // Returns the leave details if found, or null if they aren't on approved leave
//     return approvedLeave;
//   } catch (error) {
//     console.error(`Service Error - Finding approved leave for user ${userId} on ${targetDate} failed:`, error);
//     throw error;
//   }
// }








module.exports = {  getApprovedLeaveEmployeesByDate, getAllManagers, createLeaveReq, getLeaveRequestsForEmployee, updateLeaveRequestStatus, deleteLeaveRequest };