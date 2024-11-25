const {authSignInDb, authSignUpDb } = require("../models/authModel");

exports.authSignUpService = async (authInput) => {

    try {
        const auth = await authSignUpDb(authInput);
        return auth.length > 0 ? auth : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};

exports.authSignInService = async (authInput) => {

    try {
        const auth = await authSignInDb(authInput);
        return auth.length > 0 ? auth : null;
    } catch(err){
        throw new Error('Error fetching room details from the database');
    }
};