const { Router } = require('express');
const Film = require('../models/Film');

module.exports = Router()
    .post('/', (req, res, next) => {
        Film
            .create(req.body)
            .then(film => res.send(film))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Film
            .find()
            .populate('studio', { address: false, __v: false })
            .select({ cast: false, __v: false })
            .then(films => res.send(films))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Film
            .findById(req.params.id)
            .select({ __v: false, })
            .populate('reviews')
            .then(film => res.send(film.toJSON({ virtuals: true })))
            .catch(next);
    });
