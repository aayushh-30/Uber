const { validationResult } = require("express-validator");
const { getAddressCoordinate, calculateDistanceTime, getAutoCompleteSuggestionsService } = require("../services/maps.services");

const getCoordinates = async(req,res) => {
    const error = validationResult(req) 
    if(!error.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {address} = req.query;

    try {
        
        const coordinates = await getAddressCoordinate(address)

    } catch (error) {
        res.status(404).json({error:"Coordinates not found"})
    }


}


const getDistanceTime = async (req,res) => {
    try {
        const error = validationResult(req) 
        if(!error.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {source,destination} = req.query;

        const distanceTime = await calculateDistanceTime(source,destination);

        res.status(200).json(distanceTime)
        
    } catch (error) {

        console.error(error);
        res.status(404).json({error: "Distance and time not found"})
        
    }
    
}



const getAutoCompleteSuggestions = async(req,res)=>{
    try {
        const error = validationResult(req) 
        if(!error.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }

        const {address} = req.query;
        const suggestions = await getAutoCompleteSuggestionsService(address)
        res.status(200).json(suggestions)
        
    } catch (error) {
        
    }
}


module.exports = {
    getCoordinates,
    getDistanceTime,
    getAutoCompleteSuggestions
}