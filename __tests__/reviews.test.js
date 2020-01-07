require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');

describe('review routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let review;
    let reviewer;
    let film;
    let studio;
    let actor;
    beforeEach(async() => {
        studio = await Studio.create({
            name: 'Movie Makers',
            address: {
                city: 'Des Moines',
                state: 'Iowa',
                country: 'USA'
            }
        });

        actor = await Actor.create({
            name: 'Carl',
            dob: new Date('October 14, 1983'),
            pob: 'Austin, TX'
        });
        film = await Film.create({
            title: 'A movie',
            studio: studio._id,
            released: 2010,
            cast: {
                role: 'A fake person',
                actor: actor._id
            }
        });

        reviewer = await Reviewer.create({
            name: 'George Clinton',
            company: 'Funkadelictronics'
        });
        
        review = await Review.create({
            rating: 4,
            reviewer: reviewer._id,
            review: 'A movie about absolutely nothing',
            film: film._id
        });
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('should create a review', () => {
        return request(app)
            .post('/api/v1/reviews')
            .send({
                rating: 3,
                reviewer: reviewer._id,
                review: 'A movie about absolutely something',
                film: film._id
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    rating: 3,
                    reviewer: reviewer._id.toString(),
                    review: 'A movie about absolutely something',
                    film: {
                        _id: expect.any(String),
                        title: 'A movie'
                    }
                });
            });
    });
});
