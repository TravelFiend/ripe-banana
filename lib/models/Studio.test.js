const Studio = require('./Studio');

describe('studio model', () => {
    it('should require a name', () => {
        const studio = new Studio();

        const { errors } = studio.validateSync();
        expect(errors.name.message).toEqual('Path `name` is required.');
    });

    it('should be a string in the name field', () => {
        const studio = new Studio({
            name: 23
        });

        expect(studio.name).toEqual('23');
    });

    it('should be a string in the address field\'s city field', () => {
        const studio = new Studio({
            name: 23,
            address: {
                city: 12,
                state: 23,
                country: 34
            }
        });

        expect(studio.address.city).toEqual('12');
    });

    it('should be a string in the address field\'s state field', () => {
        const studio = new Studio({
            name: 23,
            address: {
                city: 12,
                state: 23,
                country: 34
            }
        });

        expect(studio.address.state).toEqual('23');
    });

    it('should be a string in the address field\'s country field', () => {
        const studio = new Studio({
            name: 23,
            address: {
                city: 12,
                state: 23,
                country: 34
            }
        });

        expect(studio.address.country).toEqual('34');
    });
});
