import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Login from '../../src/components/Login/LoginNew'
import Logout from '../../src/components/Logout/Logout'


const UnauthorizedRoute = () => {
  
  return(
  
    <Switch>
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/logout" component={Logout} />
      <Redirect to="/auth/login" />
    </Switch>
  
  )
}
export default UnauthorizedRoute