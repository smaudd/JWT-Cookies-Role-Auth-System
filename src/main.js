const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const exJWT = require('express-jwt');
const config = require('../config');
const refresh = require('./routes/refresh');
const login = require('./routes/login');
const registre = require('./routes/registre');
const cookieParser = require('cookie-parser');
const checkRole = require('./permissions');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.use(
    exJWT({ 
    secret: config.JWT_SECRET,
    // Take the cookie with the token from the request
    getToken: (req) => {
        const token = req.cookies.TOKEN;
        return token; 
    }
    }).unless({path: ['/login', '/refresh']}),
    // Handling the error
    (err, req, res, next) => {  
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        return next(err.message);
      }
});

app.use('/login', login);
app.use('/refresh', refresh);

// Middleware for role protected routes
app.use((req, res, next) => {

    app.use('/registreUser', checkRole.permit(req.cookies.TOKEN), registre)

    next();

})


// Opens a new server and connects to mongoDB
const server = app.listen(config.PORT, () => {
     mongoose.connect(config.MONGODB_URI, 
    { useNewUrlParser: true }
    );
})

const db = mongoose.connection;

// If we can't connect just throw an error
db.on('error', err => console.error(err));
// Connection successful
db.once('open', () => { console.log('Server listening on port ' + config.PORT )});

module.exports = server;