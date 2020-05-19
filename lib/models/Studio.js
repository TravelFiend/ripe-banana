const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    city: String,
    state: String,
    country: String
}, {
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.id;
        }
    }
});

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: addressSchema
}, {
    toJSON: {
        virtuals: true,
        transform: function(doc, ret){
            delete ret.id;
        }
    }
});

schema.virtual('films', {
    ref: 'Film',
    localField: '_id',
    foreignField: 'studio'
});

module.exports = mongoose.model('Studio', schema);
