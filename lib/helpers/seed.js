const chance = require('chance').Chance();
const Review = require('../models/Review');
const Reviewer = require('../models/Reviewer');
const Actor = require('../models/Actor');
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = async({ studio = 5, actors = 30, reviewers = 30, reviews = 100, films = 50 } = {}) => {
    const studios = await Studio.create([...Array(studio)].map(() => ({
        name: 'Movie Makers',
        address: {
            city: chance.city(),
            state: chance.state(),
            country: chance.country()
        }
    })));

    const createdActors = await Actor.create([...Array(actors)].map(() => ({
        name: chance.name(),
        dob: chance.date(),
        pob: `${chance.city()}, ${chance.state()} ${chance.country()}`
    })));

    const createdFilms = await Film.create([...Array(films)].map(() => ({
        title: chance.sentence(),
        studio: chance.pickone(studios.map(studio => studio._id)),
        released: (() => Math.floor(Math.random() * (9999 - 1000)) + 1000)(),
        cast: {
            role: chance.name(),
            actor: chance.pickone(createdActors.map(actor => actor._id))
        }
    })));

    const createdReviewers = await Reviewer.create([...Array(reviewers)].map(() => ({
        name: chance.name(),
        company: chance.word()
    })));

    await Review.create([...Array(reviews)].map(() => ({
        rating: chance.integer({ min: 1, max: 5 }),
        reviewer: chance.pickone(createdReviewers),
        review: chance.sentence(),
        film: chance.pickone(createdFilms.map(film => film._id))
    })));
};
