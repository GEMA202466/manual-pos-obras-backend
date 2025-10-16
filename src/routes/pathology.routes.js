const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/', (req, res) => res.json({ message: 'Listar patologias' }));

module.exports = router;
