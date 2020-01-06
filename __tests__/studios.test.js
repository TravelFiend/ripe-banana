require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

describe('studio routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let studio;
    beforeEach(async() => {
        studio = await Studio.create({
            name: 'A fine establishment',
            address: {
                city: 'Cleveland',
                state: 'Ohio',
                country: 'USA'
            }
        });
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('should create a studio', () => {
        return request(app)
            .post('/api/v1/studios')
            .send({
                name: 'A place to shoot stuff',
                address: {
                    city: 'Portland',
                    state: 'Oregon',
                    country: 'USA'
                }
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'A place to shoot stuff',
                    address: {
                        _id: expect.any(String),
                        city: 'Portland',
                        state: 'Oregon',
                        country: 'USA'
                    },
                    __v: 0
                });
            });
    });

    it('should get all studios', async() => {
        await Studio.create({
            name: 'A place to shoot stuff',
            address: {
                city: 'Portland',
                state: 'Oregon',
                country: 'USA'
            }
        });

        return request(app)
            .get('/api/v1/studios')
            .then(res => {
                res.body.forEach(studio => {
                    expect(studio).toEqual({
                        _id: expect.any(String),
                        name: studio.name,
                        address: {
                            _id: expect.any(String),
                            city: studio.address.city,
                            state: studio.address.state,
                            country: studio.address.country
                        },
                        __v: 0
                    });
                });
            });
    });
});