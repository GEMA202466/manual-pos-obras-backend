const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/', propertyController.list);
router.get('/:id', propertyController.getById);
router.post('/', propertyController.create);
router.put('/:id', propertyController.update);
router.delete('/:id', propertyController.delete);

module.exports = router;
