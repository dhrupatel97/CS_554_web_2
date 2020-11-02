import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Route } from 'react-router-dom';
import '../App.css'
import noImg from '../img/download.jpeg'

const md5 = require('blueimp-md5');

const Series = (props) => {
    const [ serData, setSerData ] = useState(undefined);
    const publickey = 'cfd681a6d619cef331d95e2c6b789e57';
    const privatekey = '473c14f840fb9d85a72def9d58924c5d77c8d7cd';
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = `https://gateway.marvel.com:443/v1/public/series/${props.match.params.id}`;
    const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

    useEffect(() => {
        async function fetchData(){
            try {
                const { data } = await axios.get(url);
                console.log(url)
                const results = data.data.results
                setSerData(results)
                console.log(results)
                } catch (e) {
                    console.log(e);
                }
            }
            fetchData();
        }, [props.match.params.id])
    
        const getImg = (item) => {
            let path = item.path
            //console.log(path)
            let variant = 'standard_amazing'
            let ext = item.extension
            let image = path + '/' + variant + '.' + ext
            if(path.includes('image_not_available')){
              return noImg
            }
            else{
              return image
            }
          }
    return (
        <div className='main'>
            <Link className='back' to='/series/page/0'>Back to all Series...</Link>
            <div className='container-series'>
            {!serData ? (<p className='error'>Error - 404 not Found</p>): (
                <div className='container'>
                    {serData && serData.map((x) => (
                        <div>
                            <h1>{x.title}</h1>
                        <div className='create'>
                                <h5>Creators</h5>
                                {x.creators.items.map((xx) => (
                                <ul className='create-list'>
                                    <ol>{xx.name ? xx.name : 'No Creators'} - {xx.role ? xx.role : 'No Role'}</ol>
                                </ul>
                            ))}
                        </div>
                        <div className='stor'>
                        <h5>Stories</h5>
                        {x.stories.items.map((xx) => (
                                <ul className='story-list'>
                                    <ol>{xx.name ? xx.name : 'No Stories'} - {xx.type ? xx.type : 'No Type'}</ol>
                                </ul>
                            ))}
                        </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div>
    )
}
 
export default Series;