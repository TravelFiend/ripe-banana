require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');

describe('reviewer routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let reviewer;
    beforeEach(async() => {
        reviewer = await Reviewer.create({
            name: 'MikeEG',
            company: 'Chinchiller'
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

    it('should get all reviewers', async() => {
        await Reviewer.create({
            name: 'Bobby Blue',
            company: 'Color Palace'
        });
        return request(app)
            .get('/api/v1/reviewers')
            .then(res => {
                res.body.forEach(reviewer => {
                    expect(reviewer).toEqual({
                        _id: expect.any(String),
                        name: reviewer.name,
                        company: reviewer.company,
                        __v: 0
                    });
                });
            });
    });

    it('should get a reviewer by id', async() => {
        return request(app)
            .get(`/api/v1/reviewers/${reviewer._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'MikeEG',
                    company: 'Chinchiller',
                    __v: 0
                });
            });
    });

    it('should update a reviewer by id', async() => {
        return request(app)
            .patch(`/api/v1/reviewers/${reviewer._id}`)
            .send({ company: 'Legwarmer' })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'MikeEG',
                    company: 'Legwarmer',
                    __v: 0
                });
            });
    });

    it('should not delete a reviewer if they have reviews', () => {

    });

    it('should delete a reviewer if they have no reviews', () => {
        return request(app)
            .delete(`/api/v1/reviewers/${reviewer._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'MikeEG',
                    company: 'Chinchiller',
                    __v: 0
                });
            });
    });
});
