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
import SignIn from './components/Login/Login';
import Login from './components/Login/LoginNew';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import Timesheet from './components/Timesheet/Timesheet';
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
              <Route path="/auth/login/" component={SignIn} />
              <Route path="/login/" component={Login} />
              <Route path="/home/" component={Home} />
              <Route path="/timesheet/" component={Timesheet} />
              <Route path="/department" component={Department} />
              <Route path="/employee" component={Employee} />
              <Route path="/project" component={Project} />
              <Route path="/task" component={Task} />
              <Route path="/profile" component={Profile} />
            </div>
          </HashRouter>
        </Provider>

      
    );
  }

export default App;
