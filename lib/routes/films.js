const { Router } = require('express');
const Film = require('../models/Film');
const Review = require('../models/Review');

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
        Promise.all([
            Film
                .findById(req.params.id)
                .populate('studio', 'name')
                .populate('cast.actor', { name: true })
                .select({ __v: false })
                .lean(),
            Review
                .find({ film: req.params.id })
                .populate('reviewer', 'name')
                .select({ film: false, __v: false })
        ])
            .then(([film, reviews]) => {
                film.reviews = reviews;
                delete film._id;
                res.send(film);
            })
            .catch(next);
    });
