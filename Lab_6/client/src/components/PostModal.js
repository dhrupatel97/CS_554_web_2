import React from 'react';
import './App.css'
import { useQuery, useMutation} from '@apollo/client';
import queries from '../queries'

function PostModal(){

    const [uploadImage] = useMutation(queries.ADD_IMAGE, {
        update(cache, {data: {uploadImage}}){
            const {unsplashImages} = cache.readQuery({ query: queries.GET_ALL });
            cache.writeQuery({
                query: queries.GET_ALL,
                data: {unsplashImages: unsplashImages.concat([uploadImage])}
            })
        }
    })
    let url;
    let description;
    let posterName;
    return(
        <div className='container'>
            <form 
            className='form'
            onSubmit = {(e) => {
            e.preventDefault();
            uploadImage({
                variables: {
                    url: url.value,
                    description: description.value,
                    posterName: posterName.value
                }
            })
            url.value = ''
            description.value = ''
            posterName.value = ''
            alert('Added new Image')
        }}>
            <div class="form-group">
                <label>URL:</label>
                <input ref={(node) => {
                    url = node}} 
                    required
                />
            </div>
            <div class="form-group">
                <label>Description:</label>
                <input ref={(node) => {
                    description = node}} 
                    required
                />
            </div>
            <div class="form-group">
                <label>Author</label>
                <input ref={(node) => {
                    posterName = node}} 
                    required
                />
            </div>
            <button className='btn btn-primary' type='submit'>ADD</button>
        </form>
        </div>
    )

}

export default PostModal;