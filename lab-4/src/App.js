import React, {Component} from 'react';
import logo from './img/mcu.png';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom";
import Character from './components/Character'
import CharacterList from './components/CharacterList'
import Comic from './components/Comic'
import ComicList from './components/ComicList'
import Series from './components/Series'
import SeriesList from './components/SeriesList'
import Home from './components/Home'
import Error from './components/Error'


class App extends Component {
  render() { 
    return (
      <Router>
      <div className='App'>
        <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Welcome</h1>
          <Link className='App-link' to='/'>
            Home
          </Link>
          <Link className='App-link' to='/characters/page/0'>
            Characters
          </Link>
          <Link className='App-link'to='/comics/page/0'>
            Comics
          </Link>
          <Link className='App-link' to='/series/page/0'>
            Series
          </Link>
        </header>
        <div className='App-body'>
            <Route exact path='/' component={Home}/>
            <Route exact path='/characters/page/:page' component={CharacterList}/>
            <Route exact path='/characters/:id' component={Character} />
            <Route exact path='/comics/page/:page' component={ComicList}/>
            <Route exact path='/comics/:id' component={Comic} />
            <Route exact path='/series/page/:page' component={SeriesList}/>
            <Route exact path='/series/:id' component={Series} />
            {/* <Route exact path = '*' component={Error}/> */}
        </div>
      </div>
      </Router>
    );
  }
}
 
export default App;