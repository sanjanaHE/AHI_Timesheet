import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGhost } from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter, Route, Link,Redirect  } from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store/store';
import Header from './components/Header/Header';
import logo from './logo.svg';
import './App.css';
import Department from './components/Department/Department';
import Employee from './components/Employee/Employee';
import Project from './components/Project/Project';
import Task from './components/Task/Task';
import Login from './components/Login/LoginNew';
import Logout from './components/Logout/Logout';
import Home from './components/Home/Home';
import Profile from './components/Profile/Profile';
import Timesheet from './components/Timesheet/Timesheet';
import { HashRouter } from 'react-router-dom';


library.add(faGhost)

const App = () => {
    return (
        <Provider store = {store}>  
         
            <HashRouter basename = "/ahits">
            <div className="App">
              <Route path="/login/" component={Login} />
              <Route path="/logout/" component={Logout} />
              <Route path="/home/" component={Home} />
              <Route path="/timesheet/" component={Timesheet} />
              <Route path="/department" component={Department} />
              <Route path="/employee" component={Employee} />
              <Route path="/project" component={Project} />
              <Route path="/task" component={Task} />
              <Route path="/profile" component={Profile} />
              {/* <Route path="/">
                <Redirect to="/login" />
              </Route> */}
             
            </div>
          </HashRouter>
         
        </Provider>

      
    );
  }

export default App;
