// import react
import React from 'react';
import { Route, Redirect } from 'react-router-dom'

// import redux
import { connect } from 'react-redux'

// import local
import * as LoginActionCreators from '../components/Login/loginAction';
import * as DepartmentActionCreators from '../components/Department/departmentAction';

import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

class AuthorizedRouteComponent extends React.Component {
  
  constructor(props){
    super(props);
    
  }

  componentWillUnmount () {
    // this.props.resetFetch();
  }
  componentDidMount() {
    if(this.props.login.dataFetched == false){
      this.props.login_actions.getLoggedUser();
    }
  }

  render() {
    const { classes } = this.props;
    const { component: Component, pending, location, ...rest } = this.props;
    // const { children:routes } = this.props;
    // console.log("PENDING is..",this.props)
    return (
      <Route {...rest} render={props => {
        if (this.props.login.dataFetched == false) {return <div><CircularProgress className={classes.progress} color="secondary" /></div>}
        else{
          // console.log("PROPS--",this.props);
          if(this.props.login.isAuthenticated == false){
            return <Redirect to={{
                          pathname: '/auth/login',
                          state: { referrer: location }
                        }}/>   
          }
          //handling routing for user role
          else if(this.props.login.data.role == "user"){
              if(this.props.location.pathname.match(/admin/)){
                return <Redirect to={{
                  pathname: '/app/home',
                  state: { referrer: location }
                }}/>
              }    
              else{
                return <Component {...this.props} />;
              }   
            } 
          else{
            return <Component {...this.props} />;
          }      
        }
      }} />
    )
  }
}

function mapStateToProps(state) {
    return {
        login: state.login,
        departments: state.departments
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login_actions: bindActionCreators(LoginActionCreators, dispatch),
        department_actions: bindActionCreators(DepartmentActionCreators, dispatch)
    }
}

const AuthorizedRoute = connect(mapStateToProps, mapDispatchToProps)(AuthorizedRouteComponent);

export default withStyles(styles)(AuthorizedRoute);