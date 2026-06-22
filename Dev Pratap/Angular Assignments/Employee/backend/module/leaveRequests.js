const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const LeaveRequests = sequelize.define('LeaveRequests', {
  LeaveRequestsID: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true, 
    field: 'LeaveRequestId' 
  },
  userId: { 
    type: DataTypes.INTEGER, 
    field: 'UserId', 
    allowNull: false 
  },
  managerId: { 
    type: DataTypes.INTEGER, 
    field: 'ManagerId', 
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'StartDate'
  },
  endDate: {
    type: DataTypes.DATEONLY, 
    allowNull: false, 
    field: 'EndDate'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'Reason'
  },
  Status: {
     type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
     defaultValue: "Pending",
     field: 'Status'
  }
}, { 
  tableName: 'LeaveRequests', 
  schema: 'dbo', 
  timestamps: true,
  createdAt: 'CreatedAt',
  updatedAt: 'UpdatedAt'
});

module.exports = LeaveRequests;