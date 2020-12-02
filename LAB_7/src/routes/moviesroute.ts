import {Request, Response} from 'express';
const movieData = require('../data/movies');

export class Movies{
    public routes(app) : void {
        app.route('/api/movies').get(async (req: Request, res: Response) => {
            try{
                let allMovies: JSON = await movieData.getAll(req.query.skip, req.query.take)
                res.status(200).json(allMovies);
            } catch(e){
                res.status(404).json({
                    error: e
                })
            }
        })

        app.route('/api/movies').post(async (req: Request, res: Response) => {
            try{
                const title: String = req.body.title
                const cast: Array<Object> = req.body.cast
                const info: Object= req.body.info
                const plot: String= req.body.plot
                const rating: Number= req.body.rating

                const insertNew: Object = await movieData.create(title, cast, info, plot, rating)
                res.status(200).json(insertNew)
            } catch(e){
                res.status(400).json({
                    error: e
                })
            }
        })

        app.route('/api/movies/:id').get(async (req: Request, res: Response) => {
            try{
                const findMovie: Object = await movieData.getMovieById(req.params.id)
                res.status(200).json(findMovie)
            } catch(e){
                res.status(404).json({
                    error: 'Movie Not Found'
                })
            }
        })

        app.route('/api/movies/:id').put(async (req: Request, res: Response) => {
            try{
                await movieData.getMovieById(req.params.id)
            } catch(e){
                res.status(404).json({
                    error: 'Movie Not found'
                })
                return;
            }

            try{
                const newTitle: String = req.body.newTitle
                const newCast: Array<Object> = req.body.newCast
                const newInfo: Object = req.body.newInfo
                const newPlot: String = req.body.newPlot
                const newRating: Number = req.body.newRating

                const updating: Object = await movieData.updateMovie(req.params.id, newTitle, newCast, newInfo, newPlot, newRating)
                res.status(200).json(updating)
            } catch(e){
                res.status(400).json({
                    error: e
                })
            }
        })

        app.route('/api/movies/:id').patch(async (req: Request, res: Response) => {
            try{
                await movieData.getMovieById(req.params.id)
            } catch(e){
                res.status(404).json({
                    error: 'Movie Not found'
                })
                return;
            }

            try{
                const newTitle: String = req.body.newTitle
                const newCast: Array<Object> = req.body.newCast
                const newInfo: Object = req.body.newInfo
                const newPlot: String = req.body.newPlot
                const newRating: Number = req.body.newRating

                const partialUpdate: Object = await movieData.partial(req.params.id, newTitle, newCast, newInfo, newPlot, newRating)
                res.status(200).json(partialUpdate)
            } catch(e){
                res.status(400).json({
                    error: e
                })
            }
        })

        app.route('/api/movies/:id/comments').post(async (req: Request, res: Response) => {
            try{
                await movieData.getMovieById(req.params.id)
            } catch(e){
                res.status(404).json({
                    error: 'Movie Not found'
                })
                return;
            }
            
            try{
                const name: String = req.body.name
                const comment: String = req.body.comment
        
                const newComment: Object = await movieData.addComment(req.params.id, name, comment)
                res.status(200).json(newComment)
            }catch(e){
                res.status(400).json({
                    error: e
                })
            }
        })

        app.route('/api/movies/:movieId/:commentId').delete(async (req: Request, res: Response) => {
            try{
                await movieData.getMovieById(req.params.movieId)
            } catch(e){
                res.status(404).json({
                    error: 'Movie Not found'
                })
                return;
            }

            try{
                await movieData.getCommentById(req.params.commentId)
            } catch(e){
                res.status(404).json({
                    error: 'Comment Not found'
                })
                return;
            }

            try{
                const toDelete: Object = await movieData.removeComment(req.params.movieId, req.params.commentId)
                res.status(200).json(toDelete)
            } catch(e){
                res.status(400).json({
                    error: e
                })
            }
        })
    }
}