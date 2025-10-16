const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');

router.use(authMiddleware);
router.get('/', (req, res) => res.json({ message: 'Listar documentos' }));
router.post('/', (req, res) => res.json({ message: 'Criar documento' }));

module.exports = router;
