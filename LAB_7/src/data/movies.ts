import { ObjectID, ObjectId } from "mongodb";
import { MongoHelper } from "../mongo.helper";

const movies = () => {
    return MongoHelper.client.db('Patel-Dhruv-CS554-Lab1').collection('movies');
}

const getAll = async(x: any, y: any): Promise<Array<Object>> => {
    
    let lim: number = 20
    let s: number = parseInt(x)

    if(y && y > 100){
        lim = 100
    }
    else{
        lim = parseInt(y)
    }

    if(isNaN(lim) || isNaN(s)){
        throw 'Query String Error'
    }
    else{
        const movieCollection: any = await movies()
        const allMovie = await movieCollection.find({}).skip(s).limit(lim).toArray();
            if(allMovie === null) {
                throw 'No data present'
            }
            else{ 
                return allMovie
            }
    } 
}

const getMovieById = async(id: ObjectId): Promise<Object> => {

    if (!id)
        throw "You must provide an id to search for a movie.";

    if (typeof 'id' !== 'string')
        throw 'Invalid Input for movie.';

    if (id === undefined)
        throw 'Undefined Data for movie.'; 

    const movieCollection :any  = await movies();
    let id_inserting = require('mongodb').ObjectId(id);

    const movie : Object = await movieCollection.findOne({_id: id_inserting});
    
    if (!movie) throw 'Movie Not Found';
    return movie;
}

const create = async(title: string, cast: Array<Object>, info: Object, plot: string, rating: number): Promise<Object> => {

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
       
    if (title.length === 0 || cast.length === 0 || info === null || plot.length === 0 || rating === null)
        throw 'Empty Fields Error'

    const movieCollection: any = await movies()
    let comm: Array<Object> = Array()

    let newMovie: Object = {
        title: title,
        cast: cast,
        info: info,
        plot: plot,
        rating: rating,
        comments: comm
    }

    const newInsertedMovie: any = await movieCollection.insertOne(newMovie)
    if(newInsertedMovie.insertedCount === 0) throw 'Insertion Failed'

    return await getMovieById(newInsertedMovie.insertedId)
}

const updateMovie = async(id: ObjectId, newTitle: string, newCast: Array<Object>, newInfo: Object, newPlot: string, newRating: number): Promise<Object> => {

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

    if (newTitle.length === 0 || newCast.length === 0 || newInfo === null || newPlot.length === 0 || newRating === null)
        throw 'Empty Fields Error'

    const movieCollection: any = await movies()
    await getMovieById(id)
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

    const updatedInfo: any = await movieCollection.updateOne(query, newMovie)
    if(updatedInfo.modifiedCount == 0){
        throw "Could not update Movie"
    }
    return await getMovieById(id)
}

const partial = async(id: ObjectId, newTitle: string, newCast: Array<Object>, newInfo: Object, newPlot: string, newRating: number): Promise<Object> => {
    
    if (!id)
        throw "You must provide an id to update for a movie.";
    
    if (newTitle === null || newCast === null || newInfo === null || newPlot === null || newRating === null)
        throw 'Empty Fields Error'

    const movieCollection: any = await movies()
    const previous = await getMovieById(id)
    
    let id1 = require('mongodb').ObjectID(id)

    let newd: Array<Object> = Array()

    if(!newTitle){
        newTitle = Object(previous)['title']
    }
    if(!newCast){
        let newCastt = Object(previous)['cast']
        for(let i in newCastt){
            newd.push(newCastt[i])
        }
    }
    if(!newInfo){
        newInfo = Object(previous)['info']
    }
    if(!newPlot){
        newPlot = Object(previous)['plot']
    }
    if(!newRating){
        newRating = Object(previous)['rating']
    }
    if(!newTitle && !newCast && !newPlot && !newRating && !newInfo){
        throw 'Need Some fields to perform PATCH'
    }
    var query = {
        _id: id1
    }
    var newMovie = {
        $set: {
            title: newTitle,
            cast: newd,
            info: newInfo,
            plot: newPlot,
            rating: newRating
        }
    }

    const updateInfo = await movieCollection.updateOne(query, newMovie)
    if(updateInfo.modifiedCount == 0){
        throw "Could not update Movie"
    }

    return await getMovieById(id)
}

const addComment = async(id: ObjectId, name: string, comment: String): Promise<Object> => {
    if (!id)
        throw "You must provide an id to add a comment for a movie.";

    if (typeof name !== 'string' || typeof comment !== 'string')
        throw 'Invalid datatype for name and comment'
    
    if (name.length === 0 || comment.length === 0)
        throw 'Empty Fields Error'

    const movieCollection: any = await movies()
    let id1 = require('mongodb').ObjectID(id)
    
    let newComment = await movieCollection.updateOne({
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

    if (!newComment.matchedCount && !newComment.modifiedCount)
    throw 'Failed to add Comment'

    return await getMovieById(id)
}

const getCommentById = async(id: ObjectId): Promise<Object> => {
    if (!id)
        throw "You must provide an id to search for a movie.";

    if (typeof 'id' !== 'string')
        throw 'Invalid Input for movie.';

    if (id === undefined)
        throw 'Undefined Data for movie.'; 

    const movieCollection :any  = await movies();
    let id_inserting = require('mongodb').ObjectId(id);

    const comm : Object = await movieCollection.findOne({"comments._id": id_inserting});
    if (!comm) throw 'Comment Not Found';
    return comm;
}

const removeComment = async(movieId: ObjectId, commentId: ObjectId): Promise<Object> => {
    if(!movieId || !commentId)
        throw 'You moust provide both MovieID and CommentID'
    
    const movieCollection: any = await movies()

    const sel = await getMovieById(movieId)

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
        throw `Could not remove comment with id of ${id1}`;
    }

    return await getMovieById(movieId)

}

module.exports = {
    create,
    getAll,
    getMovieById,
    updateMovie,
    partial,
    addComment,
    removeComment,
    getCommentById
}