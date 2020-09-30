const mongoCollections = require('../config/mongoCollections');
const { ObjectID } = require('mongodb');
const movies = mongoCollections.movies;

module.exports = {
    async create(title, cast, info, plot, rating){
        if(!title || !cast || !info || !plot || !rating)
            throw 'Your must provide relevant details'
        
        if (typeof title !== 'string' || typeof plot !== 'string')
            throw 'Invalid datatype for Title and Plot'
        
        if (typeof rating !== 'number')
            throw 'Invalid input for Rating'
        
        if (typeof info !== 'object')
            throw 'Invalid input for Info'
        
        if (!Array.isArray(cast))
            throw 'Invalid inputs for Cast'
        
        if (title === undefined || cast === undefined || info === undefined || plot === undefined || rating === undefined)
            throw 'Undefined Inputs'
        
        const movieCollection = await movies()

        let newMovie = {
            title: title,
            cast: cast,
            info: info,
            plot: plot,
            rating: rating,
            comments: []
        }
        
        const newInfo = await movieCollection.insertOne(newMovie)

        if (newInfo.insertedCount === 0)
            throw "Could not add movie.";

        const newId = newInfo.insertedId;

        const movie = await this.getMovieById(newId);
        return movie;
    },

    async getMovieById(id){
        if (arguments.length != 1)
            throw "Less Arguments.";
  
        if (!id)
            throw "You must provide an id to search for a movie.";
    
        if (typeof 'id' !== 'string')
            throw 'Invalid Input for movie.';
    
        if (id === undefined)
            throw 'Undefined Data for movie.';

        const movieCollection = await movies();

        let id_inserting = require('mongodb').ObjectId(id);

        const movi = await movieCollection.findOne({
            _id: id_inserting
        });

        if (movi === null)
            throw "No Movie ID Found.";

        return movi;
    },

    async getAll(sk, tak){
        const movieCollection = await movies();

        let lim = 20
        let s = parseInt(sk)
        if(tak){
            if (tak > 100){
                lim = 100
            }
            else{
                lim = parseInt(tak)
            }
        }
        
        const all = await movieCollection.find({}).skip(s).limit(lim).toArray();

        return all;
    },

    async updating(id, newTitle, newCast, newInfo, newPlot, newRating){
        if (arguments.length != 6)
            throw "Less Arguments.";

        if (!id)
            throw "You must provide an id to update for a movie.";
        
        if (typeof newTitle !== 'string' || typeof newPlot !== 'string')
            throw 'Invalid datatype for Title and Plot'
        
        if (typeof newRating !== 'number')
            throw 'Invalid input for Rating'
        
        if (typeof newInfo !== 'object')
            throw 'Invalid input for Info'
        
        if (!Array.isArray(newCast))
            throw 'Invalid inputs for Cast'

        const movieCollection = await movies()
        const previous = await this.getMovieById(id)
        let id1 = require('mongodb').ObjectID(id)

        var query = {
            _id: id1
        }
        var newMovie = {
            $set: {
                title: newTitle,
                cast: newCast,
                info: newInfo,
                plot: newPlot,
                rating: newRating
            }
        }

        const updateInfo = await movieCollection.updateOne(query, newMovie)
        if(updateInfo.modifiedCount == 0){
            throw "Could not update Movie"
        }

        return await this.getMovieById(id)

    },

    async partial(id, newRating){
        if (!id)
            throw  'Need ID to update'
        
        const movieCollection = await movies()
        await this.getMovieById(id)
        let id1 = require('mongodb').ObjectID(id)

        var query = {
            _id: id1
        }
        var newMovie = {
            $set: {
                rating: newRating
            }
        }

        const updateInfo = await movieCollection.updateOne(query, newMovie)
        if(updateInfo.modifiedCount == 0){
            throw "Could not update Movie"
        }

        return await this.getMovieById(id)
    },

    async addComment(id, name, comment){
        if (arguments.length != 3)
            throw "Less Arguments.";

        if (!id)
            throw "You must provide an id to add a comment for a movie.";
    
        if (typeof name !== 'string' || typeof comment !== 'string')
            throw 'Invalid datatype for name and comment'
        
        const movieCollection = await movies()
        const previous = await this.getMovieById(id)
        let id1 = require('mongodb').ObjectID(id)

        const newComments = await movieCollection.updateOne({
            _id: id1
        }, {
            "$push": {
                comments: {
                    _id: new ObjectID(),
                    name: name,
                    comment: comment
                }
            }
        })

        if (!newComments.matchedCount && !newComments.modifiedCount)
            throw 'Failed to add Comment'
        
        return await this.getMovieById(id)
    },

    async removeComment(movieId, commentId){
        if (!movieId || !commentId)
            throw 'Need ID to remvoe comment'
        
        const movieCollection = await movies()

        const sel = await this.getMovieById(movieId)

        let id2 = require('mongodb').ObjectId(movieId);
        let id1 = require('mongodb').ObjectId(commentId);

        const del = await movieCollection.findOneAndUpdate({
            _id: id2
        }, {
            "$pull": {
                comments: {
                    _id: id1
                }
            }
        })

        if (del.deletedCount === 0) {
            throw `Could not remove comment with id of ${id}.`;
        }

        return sel
    }
}