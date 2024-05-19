const express = require('express');
const router = express.Router();
const personsController = require('../../controllers/personsController');

router.get('/', personsController.getPersons);

module.exports = router;