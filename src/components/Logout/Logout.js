import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as LogoutActionCreators from './../Logout/logoutAction';
import * as LoginActionCreators from './../Login/loginAction';
import { Redirect } from 'react-router-dom'


class Logout extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        // console.log(this.props)
        this.props.logout_actions.logout()

    }
    render() {
        console.log(this.props.logout.isAuthenticated);
        if(this.props.logout.isAuthenticated == false){
            console.log("redirecting to login....")
            return <Redirect to="/login" push />
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