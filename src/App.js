import React, { Component } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGhost } from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter, Route, Link,Redirect  } from 'react-router-dom';

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
import {Main} from './main/Main';
import { HashRouter } from 'react-router-dom';


library.add(faGhost)

const App = () => {
    return (
      <React.Fragment>
      <Header style={{"flex-shrink":"0"}}/>
      <Main style={{"flex-grow":"1",overflowY:"auto"}}/>
      </React.Fragment>
    );
  }

export default App;
