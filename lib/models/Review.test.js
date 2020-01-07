const Review = require('./Review');

describe('review model', () => {
    it('should require a rating', () => {
        const review = new Review({
            reviewer: 'hdsjh345kj34hklfejh345kjh',
            review: 'Good stuff',
            film: '435h3lkj5h34lk5jhklhw4l5kjh345'
        });

        const { errors } = review.validateSync();
        expect(errors.rating.message).toEqual('Path `rating` is required.');
    });

    it('should require a reviewer', () => {
        const review = new Review({
            rating: 3,
            review: 'Good stuff',
            film: '435h3lkj5h34lk5jhklhw4l5kjh345'
        });

        const { errors } = review.validateSync();
        expect(errors.rating.message).toEqual('Path `rating` is required.');
    });

    it('should require a review', () => {
        const review = new Review({
            rating: 3,
            reviewer: 'hdsjh345kj34hklfejh345kjh',
            film: '435h3lkj5h34lk5jhklhw4l5kjh345'
        });

        const { errors } = review.validateSync();
        expect(errors.rating.message).toEqual('Path `rating` is required.');
    });

    it('should require a film', () => {
        const review = new Review({
            rating: 3,
            reviewer: 'hdsjh345kj34hklfejh345kjh',
            review: 'Good stuff',
        });

        const { errors } = review.validateSync();
        expect(errors.rating.message).toEqual('Path `rating` is required.');
    });
});
