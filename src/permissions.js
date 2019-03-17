const jwt = require('jsonwebtoken');
const config = require('../config');

exports.permit = () => {
    return (req, res, next) => {
        const token = jwt.verify(req.cookies.TOKEN, config.JWT_SECRET, (err, decoded) => {
            if (decoded && decoded.role !== 'admin') {
                res.sendStatus(403);
                return next(`You don't have rights to be here`);
            };
            next();
        });
    }
}