import React, { useEffect, useState } from 'react';
import axios from 'axios'
import {Link} from 'react-router-dom';
import '../App.css'
import noImg from '../img/download.jpeg'

const md5 = require('blueimp-md5');
const publickey = 'cfd681a6d619cef331d95e2c6b789e57';
const privatekey = '473c14f840fb9d85a72def9d58924c5d77c8d7cd';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
const url = baseUrl + '?limit=100&' + 'ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;


const CharacterList = (props) => {

    const [charData, setCharData] = useState(undefined)
    const [pageSize, setPageSize] = useState(20);
    const [pageNumber, setPageNumber] = useState(undefined);
    const [paramValue, setParamValue] = useState(undefined);

    useEffect(() => {
      setParamValue(parseInt(props.match.params.page));
      setPageNumber(parseInt(props.match.params.page));
      
      async function fetchData(){
        try {
          const { data } = await axios.get(url);
          const results = data.data
          setCharData(results)
    } catch (e) {
      console.log(e);
    }
  }
		fetchData();
  }, [pageNumber, paramValue, props.match.params.page])
    
    const getImage = (item) => {
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
        {charData && paramValue > charData.count / pageSize || paramValue < 0 ? (<p className='error'>Error</p>) : (
          <div>
          <div className='pagination'>
          {charData && paramValue != 0 ?  (<a href={`/characters/page/${paramValue - 1}`}><button className='btn'>Previous</button></a>) : (<p></p>)}
                {charData && paramValue != 4 ?(<a href={`/characters/page/${paramValue + 1}`}><button className='btn'>Next</button></a>) :  (<p></p>)}
              </div>
          <div className='cards'>
            {charData && charData.results.slice(paramValue * pageSize, (paramValue + 1) * pageSize).map((item) => {
              return (
                <div class="card" key={item.id}>
                  <a>
                    <img className='card-img' src={getImage(item.thumbnail)} alt={item.name}/>
                    <div className='card-body'>
                    <Link to={`/characters/${item.id}`}><h2>{item.name}</h2></Link>
                    </div>
                  </a>
                </div>
              )
            })}
          </div>
          </div>
        )}
      </div>
    );
}

export default CharacterList;