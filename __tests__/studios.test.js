const { getStudio, getStudios, getFilms } = require('../lib/helpers/data-helpers');

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
        await getStudios();

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
        const studio = await getStudio();
        await getFilms();

        return request(app)
            .get(`/api/v1/studios/${studio._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: studio.name,
                    address: expect.any(Object),
                    films: expect.any(Array),
                });
            });
    });
});
