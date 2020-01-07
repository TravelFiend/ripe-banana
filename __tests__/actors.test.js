require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

describe('actor routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let actor;
    beforeEach(async() => {
        actor = await Actor.create({
            name: 'MikeEG',
            dob: new Date('July 24, 1842'),
            pob: 'Cleveland, OH'
        });
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('should create an actor', () => {
        return request(app)
            .post('/api/v1/actors')
            .send({
                name: 'Doug Lass',
                dob: new Date('October 23, 1982'),
                pob: 'Georgetown, MI'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'Doug Lass',
                    dob: expect.any(String),
                    pob: 'Georgetown, MI',
                    __v: 0
                });
            });
    });

    it('should get all actors', async() => {
        await Actor.create({
            name: 'Doug Lass',
            dob: new Date('October 23, 1982'),
            pob: 'Georgetown, MI'
        });

        return request(app)
            .get('/api/v1/actors')
            .then(res => {
                res.body.forEach(actor => {
                    expect(actor).toEqual({
                        _id: expect.any(String),
                        name: actor.name
                    });
                });
            });
    });

    it('should get an actor by id', async() => {
        return request(app)
            .get(`/api/v1/actors/${actor._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'MikeEG',
                    dob: expect.any(String),
                    pob: 'Cleveland, OH',
                    __v: 0
                });
            });
    });
});
