const User = require('./userModel');
const Role = require('./roleModel');
const UserRole = require('./userRoles');
const Task = require('./taskModel');
const RefreshToken = require('./RefreshTokenModel');
const LeaveRequests = require("./leaveRequests");
const Attendance = require('./attendence');

User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId', otherKey: 'roleId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId', otherKey: 'userId' });


Task.belongsTo(User, { as: 'Assignee', foreignKey: 'assignedToUserId' });
Task.belongsTo(User, { as: 'Creator', foreignKey: 'assignedByUserId' });

RefreshToken.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });


LeaveRequests.belongsTo(User,{foreignKey: 'userId', as: 'Employee'});
LeaveRequests.belongsTo(User, {foreignKey: 'managerId', as: 'Manager' });

User.hasMany(Attendance, { foreignKey: 'userId', as: 'AttendanceRecords' });
Attendance.belongsTo(User, { foreignKey: 'userId', as: 'Employee' });

module.exports = { User, Role, UserRole, Task, RefreshToken ,LeaveRequests,Attendance};