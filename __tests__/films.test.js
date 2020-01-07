require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');

describe('film routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let review;
    let reviewer;
    let actor;
    let studio;
    let film;
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

    it('should create a film', () => {
        return request(app)
            .post('/api/v1/films')
            .send({
                title: 'A movie',
                studio: studio._id,
                released: 2010,
                cast: {
                    role: 'A fake person',
                    actor: actor.id
                }
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    title: 'A movie',
                    studio: studio._id,
                    released: 2010,
                    cast: [{
                        _id: expect.any(String),
                        role: 'A fake person',
                        actor: actor.id
                    }],
                    __v: 0
                });
            });
    });

    it('should get all films', async() => {
        await Film.create({
            title: 'Robots in outer space',
            studio: studio._id,
            released: 2013,
            cast: {
                role: 'Robot from outer space',
                actor: actor._id
            }
        });

        return request(app)
            .get('/api/v1/films')
            .then(res => {
                res.body.forEach(film => {
                    expect(film).toEqual({
                        _id: expect.any(String),
                        studio: expect.any(String)
                    });
                });
            });
    });

    it('should get a film by id', () => {
        return request(app)
            .get(`/api/v1/films/${film._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    title: 'A movie',
                    studio: studio._id,
                    released: 2010,
                    cast: [{
                        _id: expect.any(String),
                        role: 'A fake person',
                        actor: {
                            _id: expect.any(String),
                            name: 'Carl'
                        }
                    }],
                    reviews: [{
                        id: expect.any(String),
                        rating: 4,
                        reviewer: reviewer._id,
                        review: 'A movie about absolutely nothing'
                    }]
                });
            });
    });
});
