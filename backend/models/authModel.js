const mysql = require('mysql2/promise');
const dbConfig = require('../connection/connection');  // Your DB config file
const pool = mysql.createPool(dbConfig);
const bcrypt = require('bcrypt');
const secreateKey = 'country_delight';
const jwt = require('jsonwebtoken');

// exports.authSignUpDb = async (authInput) => {
//     const { email, mobile, username, password, userId } = authInput;
    
//     if(userId !== undefined && userId !== null){
//         const isUsernameUnique = await isUniqueUsername(mobile);
//         if (isUsernameUnique) {
//           return [{error: 'this mobile already used'}];
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const updateSql = 'UPDATE userstal SET password = ?, email = ?, mobile = ?, username = ? WHERE user_id = ?';
//         const [rows] = await pool.execute(updateSql, [hashedPassword, email, mobile, username, userId]);
//         return rows;
//   }else{
//       const isUsernameUnique = await isUniqueUsername(mobile);
//       if (!isUsernameUnique) {
//         return [{error: 'this mobile already used'}];
//       }
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const query = 'INSERT INTO userstal (email, mobile, username, password) VALUES (?, ?, ?, ?)';
//       const [rows] = await pool.execute(query, [email, mobile, username, hashedPassword])
//       return rows.insertId != undefined && rows.insertId != null ? [{userId: rows.insertId}] : null;
//     }
// };

// exports.authSignInDb = async (authInput) => {
//   const { mobile, password } = authInput;
  
//   const isUsernameUnique = await isUniqueUsername(mobile);
//   if (isUsernameUnique) {
//     return [{error: 'this mobile is not register'}];
//   }

//   const query = 'SELECT * FROM userstal WHERE mobile = ?';
//   const [rows] = await pool.execute(query, [mobile]);
  
//   // check password is matched or not
//   const isValidPassword = await bcrypt.compare(password, rows[0].password);
  
//   if (isValidPassword) {
//     // Password is correct, generate and send JWT
//     const token = jwt.sign({ userId: rows[0].id }, secreateKey);
//     const data = [{data: rows, auth: token}]
//     return data;
//   } else {
//     return [{status: 401, error: 'Invalid password'}];
//   }
// }

// async function isUniqueUsername(mobile) {
//     const query = 'SELECT mobile FROM userstal WHERE mobile = ?';
//     const [rows] = await pool.execute(query, [mobile]);
//     return rows.length === 0;
// }

exports.authSignUpDb = async (authInput) => {
    const { email, mobile, username, password, userId } = authInput;
    
    if(userId !== undefined && userId !== null){
        const isUsernameUnique = await isUniqueUsername(mobile);
        if (isUsernameUnique) {
          return [{error: 'this mobile already used'}];
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updateSql = 'UPDATE travelagent SET password = ?, email = ?, mobile = ?, username = ? WHERE user_id = ?';
        const [rows] = await pool.execute(updateSql, [hashedPassword, email, mobile, username, userId]);
        return rows;
  }else{
      const isUsernameUnique = await isUniqueUsername(mobile);
      if (!isUsernameUnique) {
        return [{error: 'this mobile already used'}];
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = 'INSERT INTO travelagent (agent_name, phone_number, email, password) VALUES (?, ?, ?, ?)';
      const [rows] = await pool.execute(query, [username, mobile, email, hashedPassword])
      return rows.insertId != undefined && rows.insertId != null ? [{userId: rows.insertId}] : null;
    }
};

exports.authSignInDb = async (authInput) => {
  const { mobile, password } = authInput;
  
  const isUsernameUnique = await isUniqueUsername(mobile);
  if (isUsernameUnique) {
    return [{error: 'this mobile is not register'}];
  }

  const query = 'SELECT * FROM travelagent WHERE phone_number = ?';
  const [rows] = await pool.execute(query, [mobile]);
  
  // check password is matched or not
  const isValidPassword = await bcrypt.compare(password, rows[0].password);
  
  if (isValidPassword) {
    // Password is correct, generate and send JWT
    const token = jwt.sign({ userId: rows[0].id }, secreateKey);
    const data = [{data: rows, auth: token}]
    return data;
  } else {
    return [{status: 401, error: 'Invalid password'}];
  }
}

async function isUniqueUsername(mobile) {
    const query = 'SELECT phone_number FROM travelagent WHERE phone_number = ?';
    const [rows] = await pool.execute(query, [mobile]);
    return rows.length === 0;
}