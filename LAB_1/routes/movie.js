const express = require('express');
const app = express();
const movies = require('../data/movie');
const movie = require('../data/movie');


app.post('/', async(req, res) => {
    try{
        const title = req.body.title
        const cast= req.body.cast
        const info= req.body.info
        const plot= req.body.plot
        const rating= req.body.rating

        const insertNew = await movies.create(title, cast, info, plot, rating)
    
        res.status(200).send(insertNew)
    } catch(e){
        res.status(400).send(e)
    }
})

app.get('/', async(req, res) => {
    try {
        const movieLt = await movies.getAll(req.query.skip, req.query.take);
        res.status(200).send(movieLt);
    } catch (e) {
        res.status(404).json({
            error: e
        })
    }
})

app.get('/:id', async(req, res) => {
    try{
        const findMovie = await movies.getMovieById(req.params.id)
        res.status(200).send(findMovie)
    } catch(e){
        res.status(404).send({
            error: e
        })
    }
})

app.put('/:id', async(req, res) => {
    try{
        await movies.getMovieById(req.params.id)
    } catch(e){
        res.status(404).send({
            error: e
        })
    }

    try{
        const newTitle = req.body.newTitle
        const newCast = req.body.newCast
        const newInfo = req.body.newInfo
        const newPlot = req.body.newPlot
        const newRating = req.body.newRating

        const updateMovie = await movies.updating(req.params.id, newTitle, newCast, newInfo, newPlot, newRating)
        res.status(200).send({Updated:updateMovie})

    } catch(e){
        res.status(404).send({
            error: e
        })
    }
})

app.patch('/:id', async(req, res) => {
    try{
        await movies.getMovieById(req.params.id)
    } catch(e){
        res.status(404).send({
            error: e
        })
    }

    try{
        const newRating = req.body.newRating

        const partialUpdate = await movie.partial(req.params.id, newRating)
        res.status(200).send(partialUpdate)
    } catch(e){
        res.status(404).send({
            error: e
        })
    }
})

app.post('/:id/comments', async(req, res) => {
    try{
        await movies.getMovieById(req.params.id)
    } catch(e){
        res.status(404).send({
            error: e
        })
    }

    try{
        const name = req.body.name
        const comment = req.body.comment

        const newComment = await movie.addComment(req.params.id, name, comment)
        res.status(200).send(newComment)
    }catch(e){
        res.status(404).send({
            error: e
        })
    }
})

app.delete('/:movieId/:commentId', async(req, res) => {
    try{
        await movies.getMovieById(req.params.movieId)
    } catch(e){
        res.status(404).send({
            error: e
        })
    }

    try{
        const toDelete = await movie.removeComment(req.params.movieId, req.params.commentId)
        res.status(200).send({
            deleted: true,
            toDelete
        });
    } catch(e){
        res.status(404).send({
            error: e
        })
    }
})

module.exports = app