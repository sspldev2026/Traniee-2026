const { User, Role, LeaveRequests, Attendance } = require('../module');
const { Op, fn, col } = require('sequelize');

async function generateBulkDailyAttendance(targetDate) {

  try {
    const dateToCheck = targetDate || new Date().toISOString().split('T')[0];
    console.log(dateToCheck)

    const isAlreadyRegister = await Attendance.findOne({
      where: {
        date: dateToCheck
      }
    });

    console.log("is already register", isAlreadyRegister)


    if (isAlreadyRegister !== null) {
      return {
        status: false,
        message: `Attendance has already been generated for ${dateToCheck}.`
      };
    }



    const allUsers = await User.findAll({
      attributes: ['UserID']
    })

    const approvedLeaves = await LeaveRequests.findAll({
      where: {
        Status: 'approved',
        startDate: { [Op.lte]: dateToCheck },
        endDate: { [Op.gte]: dateToCheck }
      },
      attributes: ["UserID"]
    })

    const leaveUserIdsSet = new Set(approvedLeaves.map(leave => leave.dataValues.UserID));
    // console.log(allUsers[0].dataValues.UserID)

    const attendanceRecords = allUsers.map(user => {
      const isOnLeave = leaveUserIdsSet.has(user.dataValues.UserID);

      return {
        userId: user.dataValues.UserID,
        date: dateToCheck,
        Status: isOnLeave ? 'OnLeave' : 'Absent'
      };
    });

    // 6. Bulk insert
    const createdRecords = await Attendance.bulkCreate(attendanceRecords, {
      validate: true,
    });

    return {
      message: `Successfully processed attendance for ${dateToCheck}`,
      totalRecords: createdRecords,
      date: dateToCheck
    };

  } catch (error) {
    console.log(error);
    throw error
  }
}

async function getTodayAttendaceOfEmplyoee(UserID) {
  const dateToCheck = new Date().toISOString().split('T')[0];
  try {
    const EmpToday = await Attendance.findOne({
      where: {
        UserID,
        date: dateToCheck
      }
    })
    console.log(EmpToday)
    return EmpToday
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function updateTodayAttendaceOfEmplyoee(UserID, Status) {
  const dateToCheck = new Date().toISOString().split('T')[0];
  try {
    const EmpToday = await Attendance.findOne({
      where: {
        UserID,
        date: dateToCheck
      }
    })
    EmpToday.Status = Status
    const updated = await EmpToday.save()
    console.log(updated)
    return updated
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function getTodayAttendaceOfEmplyoeesByStatus(status) {
  const dateToCheck = new Date().toISOString().split('T')[0];
  try {
    const EmpToday = await Attendance.findAll({
      where: {
        Status: status, 
        date: dateToCheck 
      },
      include: [
        {
          model: User,       
          as: 'Employee',     
          attributes: ['UserID', 'FullName', 'Email'] 
        }
      ]
    });
    
    console.log(`Found ${EmpToday.length} records for status: ${status} on ${dateToCheck}`);
    return EmpToday;
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function getAttendaceOfEmplyoeesByDate() {
  const dateToCheck = new Date().toISOString().split('T')[0];
  console.log(dateToCheck)
  try {
    const EmpToday = await Attendance.findAll({
      where: {
        date:dateToCheck
      },
      include: [
        {
          model: User,       
          as: 'Employee',     
          attributes: ['UserID', 'FullName', 'Email'] 
        }
      ]
    });
    
    console.log(`Found ${EmpToday.length} records for status: all on ${dateToCheck}`);
    return EmpToday;
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function getWeeklySummaryByDay() {
  try {
    const referenceDate = new Date();
    const dayOfWeek = referenceDate.getDay(); 
    
   
    const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const monday = new Date(referenceDate);
    monday.setDate(referenceDate.getDate() + distanceToMonday);
    
    const saturday = new Date(monday);
    saturday.setDate(monday.getDate() + 5);

    const startOfWeek = monday.toISOString().split('T')[0];
    const endOfWeek = saturday.toISOString().split('T')[0];


    const rawSummary = await Attendance.findAll({
      where: {
        date: {
          [Op.between]: [startOfWeek, endOfWeek]
        }
      },
      attributes: [
        'date',
        'Status',
        [fn('COUNT', col('AttendanceID')), 'count'] 
      ],
      group: ['date', 'Status'], 
      order: [['date', 'ASC']]
    });

    const daysMapping = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const formattedReport = {};

    // Initialize the structure for Monday through Saturday
    for (let i = 1; i <= 6; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + (i - 1));
      const dateStr = currentDay.toISOString().split('T')[0];
      
      formattedReport[dateStr] = {
        date: dateStr,
        dayName: daysMapping[currentDay.getDay()],
        Present: 0,
        Absent: 0,
        OnLeave: 0
      };
    }

  
    rawSummary.forEach(item => {
      const data = item.get({ plain: true });
      if (formattedReport[data.date]) {
        formattedReport[data.date][data.Status] = parseInt(data.count, 10);
      }
    });

    return {
      weekRange: { start: startOfWeek, end: endOfWeek },
      summary: Object.values(formattedReport) 
    };

  } catch (error) {
    console.error("Error fetching weekly daily summaries:", error);
    throw error;
  }
}





module.exports = {getWeeklySummaryByDay, getAttendaceOfEmplyoeesByDate, generateBulkDailyAttendance, getTodayAttendaceOfEmplyoee, updateTodayAttendaceOfEmplyoee, getTodayAttendaceOfEmplyoeesByStatus }
