const { getReview, getReviews, getReviewer, getFilm } = require('../lib/helpers/data-helpers');

const request = require('supertest');
const app = require('../lib/app');

describe('review routes', () => {
    it('should create a review', async() => {
        const reviewer = await getReviewer();
        const film = await getFilm();

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

    it('should get all reviews', async() => {
        await getReviews();

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

    it('should delete a review', async() => {
        const review = await getReview();

        return request(app)
            .delete(`/api/v1/reviews/${review._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    rating: review.rating,
                    reviewer: expect.any(String),
                    review: review.review,
                    film: expect.any(String),
                    __v: 0
                });
            });
    });

    it('limits to 100 reviews', async() => {
        return request(app)
            .get('/api/v1/reviews')
            .then(reviews => {
                expect(reviews.body).toHaveLength(100);
            });
    });
});
