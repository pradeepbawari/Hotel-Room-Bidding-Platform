const mysql = require('mysql2/promise');
const dbConfig = require('../connection/connection');  // Your DB config file

const pool = mysql.createPool(dbConfig);

exports.addTravelAgentToDb = async (newAgent) => {
    const {agentName, contactPerson, phoneNumber, email, address} = newAgent;
    
    const query = 'INSERT INTO travelagent (agent_name, contact_person, phone_number, email, address) VALUES (?, ?, ?, ?, ?)';
    const [rows] = await pool.execute(query, [agentName, contactPerson, phoneNumber, email, address]);
    return rows;
};

exports.deleteTravelAgentToDb = async (id) => {
    const {agentId} = id;
    const query = `DELETE FROM travelagent WHERE travel_agent_id = ? `;
    const [rows] = await pool.execute(query, [parseInt(agentId)]);
    return rows;
};

exports.updateTravelAgentToDb = async (updateAgent) => {
    const {agentName, contactPerson, phoneNumber, email, address, agentId} = updateAgent;
    
    const query = `UPDATE travelagent 
    SET agent_name = ?, 
        contact_person = ?, 
        phone_number = ?, 
        email = ?, 
        address = ? 
    WHERE travel_agent_id = ?`;
    const [rows] = await pool.execute(query, [agentName, contactPerson, phoneNumber, email, address, agentId]);
    return rows;
};

exports.listTravelAgentToDb = async (pagination) => {
    const { limit, offset } = pagination;
  
    const query = `SELECT * FROM travelagent LIMIT ? OFFSET ?`;
    const [rows] = await pool.execute(query, [limit, offset]);
    return rows;
};