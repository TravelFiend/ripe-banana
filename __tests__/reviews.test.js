const { getReview, getReviews } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('review routes', () => {
    it('should create a review', () => {
        return request(app)
            .post('/api/v1/reviews')
            .send({
                rating: 3,
                reviewer: reviewer._id,
                review: 'A movie about absolutely something',
                film: film._id
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    rating: 3,
                    reviewer: reviewer._id.toString(),
                    review: 'A movie about absolutely something',
                    film: expect.any(String),
                    __v: 0
                });
            });
    });

    it('should get all reviews', () => {
        return request(app)
            .get('/api/v1/reviews')
            .then(res => {
                res.body.forEach(review => {
                    expect(review).toEqual({
                        _id: expect.any(String),
                        rating: review.rating,
                        review: review.review,
                        film: {
                            _id: expect.any(String),
                            title: review.film.title
                        }
                    });
                });
            });
    });

    it('should delete a review', () => {
        return request(app)
            .delete(`/api/v1/reviews/${review._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: review._id.toString(),
                    rating: 4,
                    reviewer: reviewer.id.toString(),
                    review: 'A movie about absolutely nothing',
                    film: film._id.toString(),
                    __v: 0
                });
            });
    });
});
