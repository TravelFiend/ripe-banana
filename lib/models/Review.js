const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Reviewer'
    },
    review: {
        type: String,
        maxlength: 140,
        required: true
    },
    film: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Film'
    }
});

module.exports = mongoose.model('Review', schema);
