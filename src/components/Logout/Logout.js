import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as LogoutActionCreators from './../Logout/logoutAction';
import * as LoginActionCreators from './../Login/loginAction';
import { Redirect } from 'react-router-dom'


class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated : false
        }
    }
    componentDidMount() {
        // console.log(this.props)
        this.props.logout_actions.logout()
        // this.setState({isAuthenticated : this.props.logout.isAuthenticated})

    }
    componentWillReceiveProps(nextProps){
        this.setState({isAuthenticated : nextProps.logout.isAuthenticated})

    }
    render() {
        // console.log(this.props.logout.isAuthenticated);
        // console.log("LOGOUT SUCCESS---")
        // return(
        //     <div>LOGOUT SUCCESS</div>
        // )
        if(this.state.isAuthenticated == false){
            // console.log("redirecting to login....")
            return <Redirect to="/auth/login" push />
          }
    }
}
function mapStateToProps(state) {
    return {
        login: state.login,
        logout: state.logout
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login_actions: bindActionCreators(LoginActionCreators, dispatch),
        logout_actions: bindActionCreators(LogoutActionCreators, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Logout);