const express = require('express');
const router = express.Router();

const houseController = require('../controllers/houseController');

router.get('/', houseController.getAllHouses);
router.get('/:id', houseController.getHouseById);
router.post('/', houseController.newHouse);
router.put('/:id', houseController.updateHouse);
router.delete('/:id', houseController.deleteHouse);
// Create a new rental request
router.post('/houses/:id/rental-requests', houseController.createRentalRequest);

module.exports = router;