const express = require('express');
const router = express.Router();
const { simularBatalla } = require('../controllers/batallasController');

router.post('/', simularBatalla);

module.exports = router;
