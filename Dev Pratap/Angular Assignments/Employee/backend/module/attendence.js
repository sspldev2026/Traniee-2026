const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Attendance = sequelize.define('Attendance', {
  AttendanceID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, field: 'AttendanceID' },
  userId: { type: DataTypes.INTEGER, field: 'UserId', allowNull: false },
  date:{type:DataTypes.DATEONLY,field:'date',allowNull:false},
  Status:{
     type: DataTypes.ENUM("Present", "Absent","OnLeave"),
     defaultValue:"Absent"
}
}, { tableName: 'Attendance', schema: 'dbo', timestamps: false });

module.exports = Attendance;