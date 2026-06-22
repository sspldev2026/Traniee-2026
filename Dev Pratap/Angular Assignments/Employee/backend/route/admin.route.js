const express = require("express")
const { getAllEmpCont, getAllEmpContlow, getAllMngCont, updateUserHandler, deleteEmployeeHandler, getAllLeaveRequestsController, getAllLeaveRequestsByManagerController } = require("../controllers/adminContollers")
const route = express.Router()

route.get("/",getAllEmpCont)
route.get("/Employee",getAllEmpContlow)
route.patch('/:id', updateUserHandler);
route.delete('/:id', deleteEmployeeHandler);
route.get('/requests/leave', getAllLeaveRequestsController);
route.post('/Manger-requests/leave', getAllLeaveRequestsByManagerController);



module.exports = route