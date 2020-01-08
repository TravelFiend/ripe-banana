require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');

describe('reviewer routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let studio;
    let actor;
    let reviewer;
    let film;
    beforeEach(async() => {
        reviewer = await Reviewer.create({
            name: 'MikeEG',
            company: 'Chinchiller'
        });
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
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('should create a reviewer', () => {
        return request(app)
            .post('/api/v1/reviewers')
            .send({
                name: 'Bobby Blue',
                company: 'Color Palace'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'Bobby Blue',
                    company: 'Color Palace',
                    __v: 0
                });
            });
    });

    it('should get all reviewers', () => {
        return request(app)
            .get('/api/v1/reviewers')
            .then(res => {
                res.body.forEach(reviewer => {
                    expect(reviewer).toEqual({
                        _id: expect.any(String),
                        name: reviewer.name,
                        company: reviewer.company
                    });
                });
            });
    });

    it('should get a reviewer by id', async() => {
        await Review.create([{
            rating: 4,
            reviewer: reviewer._id,
            review: 'A movie about absolutely nothing',
            film: film._id
        }]);
        return request(app)
            .get(`/api/v1/reviewers/${reviewer._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'MikeEG',
                    company: 'Chinchiller',
                    reviews: [{
                        _id: expect.any(String),
                        rating: 4,
                        review: 'A movie about absolutely nothing',
                        film: {
                            _id: expect.any(String),
                            title: 'A movie'
                        }
                    }]
                });
            });
    });

    it('should not delete a reviewer if they have reviews', async() => {
        await Review.create([{
            rating: 4,
            reviewer: reviewer._id,
            review: 'A movie about absolutely nothing',
            film: film._id
        }]);

        return request(app)
            .delete(`/api/v1/reviewers/${reviewer._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    message: 'Didn\'t work',
                    status: 500
                });
            });
    });

    it('should delete a reviewer if they have no reviews', () => {
        return request(app)
            .delete(`/api/v1/reviewers/${reviewer._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'MikeEG',
                    company: 'Chinchiller',
                    reviews: [],
                    __v: 0
                });
            });
    });
});
