require('dotenv').config();
const connect = require('../utils/connect');
const mongoose = require('mongoose');
const seed = require('./seed');
const Review = require('../models/Review');
const Reviewer = require('../models/Reviewer');
const Actor = require('../models/Actor');
const Studio = require('../models/Studio');
const Film = require('../models/Film');

beforeAll(() => {
    connect();
});

beforeEach(() => {
    return mongoose.connection.dropDatabase();
});

beforeEach(() => {
    return seed({ studio: 3, actors: 15, reviewers: 15, reviews: 150, films: 25 });
});

afterAll(() => {
    return mongoose.connection.close();
});

const prepare = doc => JSON.parse(JSON.stringify(doc));

const createGetters = Model => {
    const modelName = Model.modelName;

    return {
        [`get${modelName}`]: query => Model.findOne(query).then(prepare),
        [`get${modelName}s`]: query => Model.find(query).then(docs => docs.map(prepare))
    };
};

module.exports = {
    ...createGetters(Studio),
    ...createGetters(Actor),
    ...createGetters(Film),
    ...createGetters(Reviewer),
    ...createGetters(Review),
};
