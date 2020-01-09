const { getStudio, getStudios } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('studio routes', () => {
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
                        name: studio.name
                    });
                });
            });
    });

    it('should get a studio by id', async() => {
        const actor = await Actor.create({
            name: 'Johnny Depp',
            dob: new Date('June 6, 1974'),
            pob: 'Boise, ID'
        });
        await Film.create({
            title: 'Fear and Loathing in Las Vegas',
            studio: studio._id,
            released: 1996,
            cast: [{
                role: 'Hunter S. Thompson',
                actor: actor._id
            }]
        });

        return request(app)
            .get(`/api/v1/studios/${studio._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'A fine establishment',
                    address: {
                        _id: expect.any(String),
                        city: 'Cleveland',
                        state: 'Ohio',
                        country: 'USA'
                    },
                    films: [{
                        _id: expect.any(String),
                        title: 'Fear and Loathing in Las Vegas',
                    }],
                });
            });
    });
});
