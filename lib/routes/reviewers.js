const { Router } = require('express');
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');

module.exports = Router()
    .post('/', (req, res, next) => {
        Reviewer
            .create(req.body)
            .then(reviewer => res.send(reviewer))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer
            .find()
            .select({ __v: false })
            .then(reviewers => res.send(reviewers))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Promise.all([
            Reviewer
                .findById(req.params.id)
                .select({ __v: false })
                .lean(),
            Review
                .find({ reviewer: req.params.id })
                .populate('film', { title: true })
                .select({ __v: false, reviewer: false })
        ])
            .then(([reviewer, reviews]) => {
                reviewer.reviews = reviews;
                res.send(reviewer);
            })
            .catch(next);
    })

    .patch('/:id', (req, res, next) => {
        Reviewer
            .findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(updatedReviewer => res.send(updatedReviewer))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Reviewer
            .findByIdAndDelete(req.params.id)
            .then(reviewer => res.send(reviewer))
            .catch(next);
    });
