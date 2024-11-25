const { addTravelAgentService, deleteTravelAgentService, updateTravelAgentService, listTravelAgentService } = require('../services/travelAgentService');

const addTravelAgent = async (req, res) => {
    
    try {
        const newAgent = req.body;
        const result = await addTravelAgentService(newAgent);        
        return res.status(200).send({ results: 'Agent successfully added', status: 200 });
    } catch (err) {
        console.error('Error fetching add travel agent details:', err);
        return res.status(500).send('Server connection error');
    }
};

const deleteTravelAgent = async (req, res) => {

    try {
        const agentId = req.body;
        const result = await deleteTravelAgentService(agentId);
        return res.status(200).send({results: 'Agent successfully deleted', status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel agent details:', err);
        return res.status(500).send('Server connection error');
    }
}

const updateTravelAgent = async (req, res) => {

    try {
        const updateAgent = req.body;
        const result = await updateTravelAgentService(updateAgent);
        return res.status(200).send({results: 'Agent successfully update', status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel agent details:', err);
        return res.status(500).send('Server connection error');
    }
}

const listTravelAgent = async (req, res) => {

    try {
        const pagination = req.body;
        const result = await listTravelAgentService(pagination);
        return res.status(200).send({results: result, status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel agent details:', err);
        return res.status(500).send('Server connection error');
    }
}

module.exports = { addTravelAgent, deleteTravelAgent, updateTravelAgent, listTravelAgent }