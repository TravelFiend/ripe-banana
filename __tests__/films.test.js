require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

describe('film routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

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
});
