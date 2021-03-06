import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Route } from 'react-router-dom';
import '../App.css'
import {ListGroup, ListGroupItem} from 'react-bootstrap'

const md5 = require('blueimp-md5');

const Comics = (props) => {

    const [ comData, setComData ] = useState(undefined);
    const publickey = 'cfd681a6d619cef331d95e2c6b789e57';
    const privatekey = '473c14f840fb9d85a72def9d58924c5d77c8d7cd';
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = `https://gateway.marvel.com:443/v1/public/comics/${props.match.params.id}`;
    const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;


    useEffect(() => {
        async function fetchData(){
            try {
                const { data } = await axios.get(url);
                console.log(url)
                const results = data.data.results
                setComData(results)
                console.log(results)
                } catch (e) {
                    console.log(e);
                }
            }
            fetchData();
        }, [props.match.params.id])

    return (
        <div className='main'>
            <Link className='back' to='/comics/page/0'>Back to all Comics...</Link>
            {!comData ? (<p className='error'>Error - 404 not Found</p>): (
        <div className='container'>
            <ListGroup className='comic'>
                <h2>Variants</h2>
                {comData && comData.map((x) => (
                    <div>
                        {x.variants.map((y) => (
                            <ListGroupItem>{y.name ? y.name: 'No Variant'}</ListGroupItem>
                        ))}
                    </div>
                ))}
            </ListGroup>
            <ListGroup className='story'>
                <h2>Stories</h2>
                {comData && comData.map((x) => (
                    <div>
                        {x.stories.items.map((y) => (
                            <ListGroupItem>{y.name ? y.name: 'No Stories'}</ListGroupItem>
                        ))}
                    </div>
                ))}
            </ListGroup>
        </div>
            )}
        </div>
    )
}
 
export default Comics;