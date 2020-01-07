const { Router } = require('express');
const Actor = require('../models/Actor');

module.exports = Router()
    .post('/', (req, res, next) => {
        Actor
            .create(req.body)
            .then(actor => res.send(actor))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Actor
            .find()
            .select({ name: true })
            .then(actors => res.send(actors))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Actor
            .findById(req.params.id)
            .populate('films')
            .then(actor => res.send(actor.toJSON({ virtuals: true })))
            .catch(next);
    });
