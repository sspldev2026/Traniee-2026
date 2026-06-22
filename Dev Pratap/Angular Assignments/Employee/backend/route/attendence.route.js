const express = require('express');
const { GetAttenForEmpController, updateAttenForEmpController,GetAttenForEmpByStatusController, GetAttenDetailsWeek } = require('../controllers/attendenceController');
const router = express.Router();

// Secure these endpoints with authentication middleware in production
router.get('/:id',GetAttenForEmpController);
router.get('/Atendace/:status',GetAttenForEmpByStatusController);
router.patch("/:id",updateAttenForEmpController)
router.get('/Details/week',GetAttenDetailsWeek);

module.exports = router;