import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as LoginActionCreators from './../Login/loginAction'
import Header from './../Header/Header';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  });

class Profile extends Component {
    componentDidMount(){
        this.props.login_actions.getLoggedUser();
    }
    constructor(props){
        super(props);
        

    }
  render() {
    const { classes } = this.props;
      console.log(this.props);
    return (
        <React.Fragment>
       
            <Header></Header>  
            <div style={{margin : "2%"}}>
                <h1>Profile</h1>
                <Paper>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                    First name
                    </Grid>
                    <Grid item xs={6}>
                    {this.props.login.data.firstName}
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                    Last name
                    </Grid>
                    <Grid item xs={6}>
                    {this.props.login.data.lastName}
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                    DOB
                    </Grid>
                    <Grid item xs={6}>
                    {this.props.login.data.dob}
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                    Role
                    </Grid>
                    <Grid item xs={6}>
                    {this.props.login.data.role}
                    </Grid>
                </Grid>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                    Designation
                    </Grid>
                    <Grid item xs={6}>
                    {this.props.login.data.designation}
                    </Grid>
                </Grid>
                </Paper>
            </div>
        </React.Fragment>
    )
  }
}

function mapStateToProps(state){
    return {
        login: state.login
    }
}

function mapDispatchToProps(dispatch){
    return {
        login_actions: bindActionCreators(LoginActionCreators, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Profile));