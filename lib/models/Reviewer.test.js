const Reviewer = require('./Reviewer');

describe('reviewer model', () => {
    it('should require name', () => {
        const reviewer = new Reviewer();

        const { errors } = reviewer.validateSync();
        expect(errors.name.message).toEqual('Path `name` is required.');
    });

    it('should require company', () => {
        const reviewer = new Reviewer();

        const { errors } = reviewer.validateSync();
        expect(errors.company.message).toEqual('Path `company` is required.');
    });

    it('should be a string in the name field', () => {
        const reviewer = new Reviewer({ name: 23, company: 32 });
        expect(reviewer.name).toEqual('23');
    });

    it('should be a string in the name field', () => {
        const reviewer = new Reviewer({ name: 23, company: 32 });
        expect(reviewer.company).toEqual('32');
    });
});
