const { getReviewer, getReviewers, getReview } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('reviewer routes', () => {
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
        await getReviewers();

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
        await getReview();
        const reviewer = await getReviewer();

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

    it('should delete a reviewer if they have no reviews', async() => {
        const reviewer = await getReviewer();

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

    it('should not delete a reviewer if they have reviews', async() => {
        const reviewer = await getReviewer();
        await getReview();

        return request(app)
            .delete(`/api/v1/reviewers/${reviewer._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    message: 'Didn\'t work',
                    status: 500
                });
            });
    });
});
