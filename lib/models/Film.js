const mongoose = require('mongoose');

const castSchema = new mongoose.Schema({
    role: String,
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Actor'
    }
}, {
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.id;
        }
    }
});

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    released: {
        type: Number,
        minlength: 4,
        maxlength: 4,
        required: true
    },
    cast: [castSchema]
}, {
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.id;
        }
    }
});

schema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'film'
});

module.exports = mongoose.model('Film', schema);
