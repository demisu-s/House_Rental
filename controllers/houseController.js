const House = require('../models/houseModel')
const multer = require('multer')

exports.getAllHouses = async (req, res) => {
    try{
        const houses = await House.find()
        res.status(200).json(houses)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

exports.getHouseById = async (req,res) => {
    try {
        const house = await House.findById(req.params.id)
        if(!house)
            return res.status(404).json({message: 'House not found'})
        else
            res.status(200).json(house)
    }
    catch(err) {
        res.status(500).json({message: err.message})
    }
}

const Storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    },
})

const upload = multer({
    storage: Storage
}).single('photo')

exports.newHouse = async (req, res) => {
    const house = new House({
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        square_feet: req.body.square_feet,
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
        price: req.body.price,
        property_type: req.body.property_type,
        images: {
            data: upload(req,res,(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    req.file.filename
                }
            }),
            contentType: 'image/jpg'
        },
        tenant: req.body.tenant,
        broker: req.body.broker,
    })

    try {
        const savedHouse = await house.save()
        res.status(201).json(savedHouse)
    }
    catch(err) {
        res.status(500).json({message: err.message})
    }
}

// Handle rental requests from renters 
exports.createRentalRequest = asyncHandler(async (req, res) => { 
    const house = await House.findById(req.params.id); 
    const { startDate, endDate } = req.body;
    if (house.availableDates.includes(startDate) && house.availableDates.includes(endDate)) { 
        // Add rental request to house object 
        house.rentalRequests.push({ startDate, endDate, renter: req.user.id }); 
        await house.save(); 
        return res.status(200).json(house); 
    } 
    return res.status(400).json({ error: "House is not available for specified dates" }); 
});

//Landlords/Brokers can view details of all rental requests for their houses
exports.getRentalRequests = asyncHandler(async (req, res) => {
    const house = await House.findById(req.params.id);
  
    if (house.landlord.id.equals(req.user.id) || house.broker.id.equals(req.user.id)) {
        const rentalRequests = house.rentalRequests.map(req => {
            return {
              id: req._id,
              startDate: req.startDate,
              endDate: req.endDate,
              renter: {
                id: req.renter._id,
                name: req.renter.name,
                email: req.renter.email,
              },
            };
          });
        return res.status(200).json(rentalRequests);
    }
  
    return res.status(403).json({ error: 'You are not authorized to view the rental requests for this house.' });
  });

  //approve
  exports.approveRentalRequest = asyncHandler(async (req, res) => {
    const house = await House.findById(req.params.id);
    
    if (!house.landlord.equals(req.user.id) && !house.broker.equals(req.user.id)) {
        return res.status(401).json({ error: 'Unauthorized user' });
    }
    
    const rentalRequest = house.rentalRequests.id(req.params.rentalRequestId);
  
    if (!rentalRequest) {
      return res.status(404).json({ error: 'Rental request not found' });
    }
  
    if (house.status !== 'available') {
      return res.status(400).json({ error: 'House is not available for rental requests' });
    }
  
    if (house.status !== 'rented') {
      rentalRequest.set({
        approved: true,
        approvedAt: new Date(),
      });
      house.status = 'rented';
      house.startDate = rentalRequest.startDate;
      house.endDate = rentalRequest.endDate;
      await house.save();
      return res.status(200).json({ message: 'Rental request approved' });
    }
  
    return res.status(400).json({ error: 'House is already rented for the specified dates' });
  });

  //reject
  exports.rejectRentalRequest = asyncHandler(async (req, res) => {
    const house = await House.findById(req.params.id);
    
    if (!house.landlord.equals(req.user.id) && !house.broker.equals(req.user.id)) {
        return res.status(401).json({ error: 'Unauthorized user' });
    }
    
    const rentalRequest = house.rentalRequests.id(req.params.rentalRequestId);
  
    if (!rentalRequest) {
      return res.status(404).json({ error: 'Rental request not found' });
    }
  
    if (house.status !== 'available') {
      return res.status(400).json({ error: 'House is not available for rental requests' });
    }
  
    if (house.status !== 'rented') {
      rentalRequest.remove();
      await house.save();
      returnres.status(200).json({ message: 'Rental request rejected' });
    }
  
    return res.status(400).json({ error: 'House is already rented for the specified dates' });
  });

  //propose
  exports.proposeAlternativeDates = asyncHandler(async (req, res) => {
    const house = await House.findById(req.params.id);
    
    if (!house.landlord.equals(req.user.id) && !house.broker.equals(req.user.id)) {
        return res.status(401).json({ error: 'Unauthorized user' });
    }
    
    const rentalRequest = house.rentalRequests.id(req.params.rentalRequestId);
  
    if (!rentalRequest) {
      return res.status(404).json({ error: 'Rental request not found' });
    }
  
    if (house.status !== 'available') {
      return res.status(400).json({ error: 'House is not available for rental requests' });
    }
  
    if (house.status !== 'rented') {
      rentalRequest.set({
        proposedAlternativeDates: req.body.alternativeDates,
      });
      await house.save();
      return res.status(200).json({ message: 'Alternative dates proposed' });
    }
  
    return res.status(400).json({ error: 'House is already rented for the specified dates' });
  });


exports.updateHouse = async (req, res) => {
    const house = {
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        square_feet: req.body.square_feet,
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
        price: req.body.price,
        property_type: req.body.property_type,
        images: {
            data: upload(req,res,(err)=>{
                if(err){
                    console.log(err)
                }
                else{
                    req.file.filename
                }
            }),
            contentType: 'image/jpg'
        },
        tenant: req.body.tenant,
        broker: req.body.broker,
    }

    try {
        const updatedHouse = await House.findByIdAndUpdate(req.params.id, house, { new: true });
        res.status(200).json(updatedHouse);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteHouse = async (req, res) => {
    try {
      await House.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'House deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}