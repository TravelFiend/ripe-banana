const { Router } = require('express');
const Reviewer = require('../models/Reviewer');

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
            .then(reviewers => res.send(reviewers))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Reviewer
            .findById(req.params.id)
            .then(reviewer => res.send(reviewer))
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
