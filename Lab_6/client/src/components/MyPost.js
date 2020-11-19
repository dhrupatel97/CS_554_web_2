import React, {useState} from 'react';
import './App.css'
import { useQuery, useMutation} from '@apollo/client';
import queries from '../queries'
import { add } from 'lodash';

function MyPost(){

    const {loading, error, data} = useQuery(
        queries.GET_USER_POSTED,{
            fetchPolicy: 'cache-and-network'
        }
    )

    
    const [updateImage] = useMutation(queries.UPDATE_IMAGE)
    
    const handleAddToBin = (single, e) => {
        e.preventDefault()
        let changeing = true
        updateImage({
            variables: {
                id: single,
                binned: changeing
            }
        })
        alert('Successfully Added to Bin')
    }

    if (data){
        console.log(data)
        const {userPostedImages} = data;

        return(
            <div className='container'>
                <div className='card-columns'>
                    {userPostedImages.map((x) => {
                        return(
                        <div className='container'>
                            <div className="card" style={{width: "18rem"}} key={x.id}>
                                <img class="card-img-top" src={x.url} alt={x.posterName}></img>
                                <div className="card-body">
                                    <h5 className="card-title">Author: {x.posterName}</h5>
                                    <p className="card-text">
                                    {x.description ? x.description : 'No Description Available'}
                                    </p>
                                </div>
                                <button className='btn btn-primary' onClick={e => handleAddToBin(x.id, e)}>Add to Bin</button>
                            </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
    else if (loading){
        return (<div>Loading...</div>)
    }
    else if(error){
        return (<div>{error.message}</div>)
    }
}

export default MyPost;