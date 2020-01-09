const { getActor, getActors } = require('../lib/helpers/data-helpers');

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
        const studio = await Studio.create({
            name: 'Movie Makers',
            address: {
                city: 'Des Moines',
                state: 'Iowa',
                country: 'USA'
            }
        });

        await Film.create({
            title: 'A Movie',
            studio: studio._id,
            released: 2010,
            cast: {
                role: 'A fake person',
                actor: actor._id
            }
        });
        
        return request(app)
            .get(`/api/v1/actors/${actor._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    name: 'MikeEG',
                    dob: actor.dob.toISOString(),
                    pob: 'Cleveland, OH',
                    films: [{
                        _id: expect.any(String),
                        title: 'A Movie',
                        released: 2010
                    }]
                });
            });
    });
});
