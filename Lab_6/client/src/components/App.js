import React from 'react';
import './App.css';
import { NavLink, BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Home'
import MyBin from './MyBin'
import MyPost from './MyPost'
import PostModal from './PostModal'
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className='App-header'>
            <h1 className='App-title'>
              Binterest
            </h1>
            <nav>
              <NavLink className='navlink' to='/'>
                Home
              </NavLink>
              <NavLink className='navlink' to='/my-bin'>
                My Bin
              </NavLink>
              <NavLink className='navlink' to='/my-posts'>
                My Posts
              </NavLink>
              <NavLink className='navlink' to='/new-post'>
                New Post
              </NavLink>
            </nav>
          </header>
          <Route exact path="/" component={Home} />
          <Route path="/my-bin" component={MyBin} />
          <Route path="/my-posts" component={MyPost} />
          <Route path="/new-post" component={PostModal}/>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
