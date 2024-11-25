const { addTravelAgentToDb, deleteTravelAgentToDb, updateTravelAgentToDb, listTravelAgentToDb } = require("../models/travelAgentModel");

exports.addTravelAgentService = async (newAgent) => {
    try {
        const agentDetails = await addTravelAgentToDb(newAgent);
        return agentDetails.length > 0 ? agentDetails : null;
    } catch (err) {
        throw new Error('Error fetching room details from the database');
    }
};

exports.deleteTravelAgentService = async (agentId) => {

    try {
        const agentDetails = await deleteTravelAgentToDb(agentId);
        return agentDetails.length > 0 ? agentDetails : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};

exports.updateTravelAgentService = async (updateAgent) => {

    try {
        const agentDetails = await updateTravelAgentToDb(updateAgent);
        return agentDetails.length > 0 ? agentDetails : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};

exports.listTravelAgentService = async (pagination) => {

    try {
        const agentDetails = await listTravelAgentToDb(pagination);
        return agentDetails.length > 0 ? agentDetails : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};