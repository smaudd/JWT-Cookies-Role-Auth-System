const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    session: {
        type: String,
        required: true
    }
});

// Use some time-stamp system here to keep track of the sessions 

module.exports = mongoose.model('Session', SessionSchema);