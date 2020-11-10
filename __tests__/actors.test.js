const { getActor, getActors, getFilms } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('actor routes', () => {
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
        await getActors();

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
        const actor = await getActor();
        await getFilms();
        
        return request(app)
            .get(`/api/v1/actors/${actor._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    name: actor.name,
                    dob: actor.dob,
                    pob: actor.pob,
                    films: expect.any(Array)
                });
            });
    });
});
