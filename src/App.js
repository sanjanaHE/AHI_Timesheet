import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store/store';
import Header from './components/Header/Header';
import logo from './logo.svg';
import './App.css';
import Department from './components/Department/Department';
import Employee from './components/Employee/Employee';
import Project from './components/Project/Project';
import Task from './components/Task/Task';
import Login from './components/Login/Login';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { HashRouter } from 'react-router-dom'
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});
const App = () => {
    return (
        <Provider store = {store}>  
            <HashRouter basename = "/ahits">
            <div className="App">
              <Header>
              </Header>
              <Route path="/auth/login/" component={Login} />
              <Route path="/department" component={Department} />
              <Route path="/employee" component={Employee} />
              <Route path="/project" component={Project} />
              <Route path="/task" component={Task} />
            </div>
          </HashRouter>
        </Provider>

      
    );
  }

export default App;
