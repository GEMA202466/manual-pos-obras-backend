const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/', maintenanceController.list);
router.get('/:id', maintenanceController.getById);
router.post('/', maintenanceController.create);
router.put('/:id', maintenanceController.update);
router.delete('/:id', maintenanceController.delete);

module.exports = router;
