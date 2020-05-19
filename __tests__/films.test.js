const { getFilm, getFilms, getStudio, getActor, getReviews } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('film routes', () => {
    it('should create a film', async() => {
        const studio = await getStudio();
        const actor = await getActor();

        return request(app)
            .post('/api/v1/films')
            .send({
                title: 'A movie',
                studio: studio._id,
                released: 2010,
                cast: {
                    role: 'A fake person',
                    actor: actor._id
                }
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    title: 'A movie',
                    studio: expect.any(String),
                    released: 2010,
                    cast: [{
                        _id: expect.any(String),
                        role: 'A fake person',
                        actor: actor._id
                    }],
                    __v: 0
                });
            });
    });

    it('should get all films', async() => {
        await getFilms();
        const studio = await getStudio();

        return request(app)
            .get('/api/v1/films')
            .then(res => {
                res.body.forEach(film => {
                    expect(film).toEqual({
                        _id: expect.any(String),
                        title: film.title,
                        released: film.released,
                        studio: {
                            _id: expect.any(String),
                            name: studio.name
                        },
                    });
                });
            });
    });

    it('should get a film by id', async() => {
        const film = await getFilm();
        const reviews = await getReviews({ film: film._id });

        return request(app)
            .get(`/api/v1/films/${film._id}`)
            .then(res => {
                expect(res.body.reviews).toHaveLength(reviews.length);
                expect(res.body).toEqual({
                    title: film.title,
                    studio: expect.any(Object),
                    released: film.released,
                    cast: expect.any(Array),
                    reviews: expect.any(Array)
                });
            });
    });
});
