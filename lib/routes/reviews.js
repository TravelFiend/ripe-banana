const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
    .post('/', (req, res, next) => {
        Review
            .create(req.body)
            .then(review => res.send(review))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Review
            .find()
            .limit(100)
            .populate('film', { title: true })
            .select({ reviewer: false, __v: false })
            .then(review => res.send(review))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Review
            .findByIdAndDelete(req.params.id)
            .then(review => res.send(review))
            .catch(next);
    });
