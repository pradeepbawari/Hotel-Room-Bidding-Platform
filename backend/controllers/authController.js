const { transformKeysToCamelCase } = require("../core/utiles");
const { authSignUpService, authSignInService } = require("../services/authService");

const signUpCotrl = async (req, res) => {

    try {
        const authInput = req.body;
        const result = await authSignUpService(authInput);
        return res.status(200).send({results: result, status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel agent details:', err);
        return res.status(500).send('Server connection error');
    }
}

const signInCotrl = async (req, res) => {

    try {
        const authInput = req.body;
        let result = await authSignInService(authInput);
        if(result[0]?.data[0]) {
            result[0].data[0] = transformKeysToCamelCase(result[0]?.data[0]);
        }
        return res.status(200).send({results: result, status: 200})     
    } catch(err) {
        console.error('Error fetching delete travel agent details:', err);
        return res.status(500).send('Server connection error');
    }
}


module.exports = { signUpCotrl, signInCotrl }