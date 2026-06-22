const express = require('express');
const router = express.Router();
const { getManagerController, createLeaveReqController, getLeaveReqController, updateStatuesLeaveReqController, deleteLeaveReqController } = require('../controllers/leaveReqContollers');
const authorize = require('../middleware/role.middleware');

// Secure these endpoints with authentication middleware in production
router.get('/getManager',getManagerController);
router.post("/request",createLeaveReqController)
router.post("/myLeaveRequests",getLeaveReqController)
router.patch("/:id",authorize("Manager"),updateStatuesLeaveReqController)
router.delete("/:id",authorize("Manager"),deleteLeaveReqController)

module.exports = router;