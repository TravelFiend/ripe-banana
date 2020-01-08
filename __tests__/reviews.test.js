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
                    film: expect.any(String),
                    __v: 0
                });
            });
    });

    it('should get all reviews', () => {
        return request(app)
            .get('/api/v1/reviews')
            .then(res => {
                res.body.forEach(review => {
                    expect(review).toEqual({
                        _id: expect.any(String),
                        rating: review.rating,
                        review: review.review,
                        film: {
                            _id: expect.any(String),
                            title: review.film.title
                        }
                    });
                });
            });
    });

    it('should delete a review', () => {
        return request(app)
            .delete(`/api/v1/reviews/${review._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: review._id.toString(),
                    rating: 4,
                    reviewer: reviewer.id.toString(),
                    review: 'A movie about absolutely nothing',
                    film: film._id.toString(),
                    __v: 0
                });
            });
    });
});