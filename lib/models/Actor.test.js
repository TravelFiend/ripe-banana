const Actor = require('./Actor');

describe('actor model', () => {
    it('should require a name', () => {
        const actor = new Actor();

        const { errors } = actor.validateSync();
        expect(errors.name.message).toEqual('Path `name` is required.');
    });

    it('should be a string in the name field', () => {
        const actor = new Actor({ name: 23 });

        expect(actor.name).toEqual('23');
    });

    it('should be a date in the dob field', () => {
        const actor = new Actor({ dob: 'Not a date' });

        const { errors } = actor.validateSync();
        expect(errors.dob.message).toEqual('Cast to date failed for value \"Not a date\" (type string) at path \"dob\"');
    });

    it('should be a string in the pob field', () => {
        const actor = new Actor({ pob: 23 });

        expect(actor.pob).toEqual('23');
    });
});
