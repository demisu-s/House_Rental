const express = require('express');
const router = express.Router();

const houseController = require('../controllers/houseController');

router.get('/', houseController.getAllHouses);
router.get('/:id', houseController.getHouseById);
router.post('/', houseController.newHouse);
router.put('/:id', houseController.updateHouse);
router.delete('/:id', houseController.deleteHouse);
// Create a new rental request
router.post('/rental-requests/:id', houseController.createRentalRequest);

router.get('/rental-requests', houseController.getRentalRequests)

// Approve a rental request
router.put('/rental-requests/:id/:rentalRequestId/approve', houseController.approveRentalRequest);

// Reject a rental request
router.put('/rental-requests/:id/:rentalRequestId/reject', houseController.rejectRentalRequest);

// Propose alternative dates for a rental request
router.put('/rental-requests/:id/:rentalRequestId/propose-alternative-dates', houseController.proposeAlternativeDates);

module.exports = router;