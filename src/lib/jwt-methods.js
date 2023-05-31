const jwt = require("jsonwebtoken");

const MAX_AGE = 24 * 60 * 60 * 7; // token is good for a week

const jwt_secret = process.env.JWT_SECRET || "a secret for local JWT testing";

// method to create a signed token
const createToken = (identifier) => jwt.sign({ identifier }, jwt_secret, { expiresIn: MAX_AGE });

// method to confirm token is signed and in-date; returns id if there is on, or null otherwise
const getIdentifierFromToken = (token) => {
    
    try {
        const data = jwt.verify(token, jwt_secret);
        if (data.identifier) {
            return data.identifier;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export {
    createToken,
    getIdentifierFromToken,
    MAX_AGE
}
