import React from 'react';
import { Switch, Route } from 'react-router-dom'
import Home from '../components/Home/Home'
import Timesheet from '../components/Timesheet/Timesheet'
import Department from '../components/Department/Department'
import Employee from '../components/Employee/Employee'
import Project from '../components/Project/Project'
import Task from '../components/Task/Task'
import Profile from '../components/Profile/Profile'
import ChangePassword from '../components/ChangePassword/ChangePassword'
import Client from '../components/Client/Client'
export const Main = () =>

  (
    <main>
      {/* <Switch> */}
          <Route path="/app/home/" component={Home} />
          <Route path="/app/timesheet/" component={Timesheet} />
          <Route path="/app/admin/department" component={Department} />
          <Route path="/app/admin/employee" component={Employee} />
          <Route path="/app/admin/project" component={Project} />
          <Route path="/app/admin/client" component={Client} />
          <Route path="/app/task" component={Task} />
          <Route path="/app/profile" component={Profile} />
          <Route path="/app/changePassword" component={ChangePassword} />
          <Route exact path='/app' component={Home} />
      {/* </Switch> */}
    </main>
  )