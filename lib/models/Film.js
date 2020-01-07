const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
    role: String,
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    released: {
        type: Number,
        minlength: 4,
        maxlength: 4,
        required: true
    },
    cast: [castSchema]
});

schema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'film'
});

module.exports = mongoose.model('Film', schema);
