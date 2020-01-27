const express = require('express');
const router = express.Router();
const urlController = require('../controllers/url');

router.post('/register.json', urlController.register);

router.get('/:_id', urlController.redirect);

router.get('/:_id/stats', urlController.stats);

module.exports = router;
