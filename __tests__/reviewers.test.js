const { getReviewer, getReviewers, getReview, getReviews } = require('../lib/helpers/data-helpers');
const Review = require('../lib/models/Review');

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
        const reviewer = await getReviewer();
        const reviews = await getReviews({ reviewer: reviewer._id });

        return request(app)
            .get(`/api/v1/reviewers/${reviewer._id}`)
            .then(res => {
                expect(res.body.reviews).toHaveLength(reviews.length);
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: reviewer.name,
                    company: reviewer.company,
                    reviews: expect.any(Array)
                });
            });
    });

    it('should not delete a reviewer if they have reviews', async() => {
        const review = await getReview();
        const reviewer = await getReviewer({ _id: review.reviewer });
        
        return request(app)
            .delete(`/api/v1/reviewers/${reviewer._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    message: 'Unable to delete, reviewer has active reviews',
                    status: 500
                });
            });
    });

    it('should delete a reviewer if they have no reviews', async() => {
        const reviewer1 = await getReviewer();
        await Review.deleteMany({ reviewer: reviewer1._id });

        return request(app)
            .delete(`/api/v1/reviewers/${reviewer1._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: reviewer1.name,
                    company: reviewer1.company,
                    __v: 0
                });
            });
    });
});
