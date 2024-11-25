// const mysql = require('mysql2');

// const connection = mysql.createConnection({
//     host: 'localhost', // Replace with your database host
//     user: 'root', // Replace with your database user
//     password: '', // Replace with your database password
//     database: 'hotelroomdeals' // Replace with your database name
// });

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err.stack);
//         return; 
//     }
//     console.log('Connected to the database.');
// });

// module.exports = connection;

module.exports = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hotelroomdeals',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};