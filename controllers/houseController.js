const House = require('../models/houseModel')

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
        images: req.body.images,
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
        images: req.body.images,
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