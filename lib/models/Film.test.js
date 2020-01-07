const Film = require('./Film');

describe('film model', () => {
    it('should require title', () => {
        const film = new Film({
            studio: 'MGM',
            released: 2002,
            cast: [{
                role: 'A doofus',
                actor: 'James Franco'
            }]
        });

        const { errors } = film.validateSync();
        expect(errors.title.message).toEqual('Path `title` is required.');
    });

    it('should require studio', () => {
        const film = new Film({
            title: 'A movie about stuff',
            released: 2002,
            cast: [{
                role: 'A doofus',
                actor: 'James Franco'
            }]
        });

        const { errors } = film.validateSync();
        expect(errors.studio.message).toEqual('Path `studio` is required.');
    });

    it('should require released', () => {
        const film = new Film({
            title: 'A movie about stuff',
            studio: 'MGM',
            cast: [{
                role: 'A doofus',
                actor: 'James Franco'
            }]
        });

        const { errors } = film.validateSync();
        expect(errors.released.message).toEqual('Path `released` is required.');
    });

    it('should require actor', () => {
        const film = new Film({
            title: 'A movie about stuff',
            studio: 'MGM',
            released: 2002,
            cast: [{
                role: 'A doofus'
            }]
        });

        const { errors } = film.validateSync();
        expect(errors.cast.actor.message).toEqual('Path `actor` is required.')
    });
});
