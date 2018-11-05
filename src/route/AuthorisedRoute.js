// import react
import React from 'react';
import { Route, Redirect } from 'react-router-dom'

// import redux
import { connect } from 'react-redux'

// import local
import * as LoginActionCreators from '../components/Login/loginAction';
import { bindActionCreators } from 'redux';


class AuthorizedRouteComponent extends React.Component {
  
  componentWillUnmount () {
    // this.props.resetFetch();
  }
  componentDidMount() {
    this.props.login_actions.getLoggedUser();
  }

  render() {
    
    const { component: Component, pending, location, ...rest } = this.props;
    const { children:routes } = this.props;
    return (
      <Route {...rest} render={props => {
        if (pending) {return <div>Loading...</div>}
        else{
          if(this.props.login.isAuthenticated == false){
            return <Redirect to={{
                          pathname: '/auth/login',
                          state: { referrer: location }
                        }}/>   
          }else{
            return <Component {...this.props} />;
          }             
        }
      }} />
    )
  }
}

function mapStateToProps(state) {
    return {
        login: state.login
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login_actions: bindActionCreators(LoginActionCreators, dispatch)
    }
}

const AuthorizedRoute = connect(mapStateToProps, mapDispatchToProps)(AuthorizedRouteComponent);

export default AuthorizedRoute