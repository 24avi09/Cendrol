const JWT = require("jsonwebtoken");

/// ===== Authentication  ===========

const authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token)
            return res
                .status(401)
                .send({ status: false, msg: "token must be present" });

        token = token.replace(/^Bearer\s+/, "");

        JWT.verify(token, "UserSecreteKey", function (error, validToken) {
            if (error) {
                return res.status(401).send({ status: false, msg: error.message });
            } else {
                req.token = validToken;
                next();
            }
        });

    } catch (err) {
        res.status(500).send({ status: "error", error: err.message });
    }
};

module.exports = { authentication };