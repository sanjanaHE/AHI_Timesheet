import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as LoginActionCreators from './../Login/loginAction'
import Header from './../Header/Header';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableCell from '@material-ui/core/TableCell/TableCell';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper/Paper';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    tableStyle:{
        width : "30%",
        display:"inline-block"
    },
});

class Profile extends Component {
    componentDidMount() {
        this.props.login_actions.getLoggedUser();
    }
    constructor(props) {
        super(props);


    }
    render() {
        const { classes } = this.props;
        // console.log(this.props);
        return (
            <React.Fragment>
                <div style={{ margin: "2%" }}>
                    <h1>Profile</h1>
                    <Paper style={{ width:"50%",marginLeft:"auto",marginRight:"auto",textAlign:"left"}}>
                        <Grid container spacing={24} style={{marginLeft:"5%",marginRight:"5%"}}>
                            <Grid item md={6} sm={6} xs={6}>
                                First name
                            </Grid>
                            <Grid item md={6} sm xs>
                                {this.props.login.data.firstName}
                            </Grid>
                            <Grid item md={6} sm={6} xs={6}>
                                Last name
                            </Grid>
                            <Grid item md={6} sm xs>
                                {this.props.login.data.lastName}
                            </Grid>
                            <Grid item md={6} sm={6} xs={6}>
                                Email
                            </Grid>
                            <Grid item md={6} sm xs>
                                {this.props.login.data.email}
                            </Grid>
                            <Grid item md={6} sm={6} xs={6}>
                                DOB
                            </Grid>
                            <Grid item md={6} sm xs>
                                {this.props.login.data.dob}
                            </Grid>
                            <Grid item md={6} sm={6} xs={6}>
                                Designation
                            </Grid>
                            <Grid item md={6} sm xs>
                                {this.props.login.data.designation}
                            </Grid>
                            <Grid item md={6} sm={6} xs={6}>
                                Role
                            </Grid>
                            <Grid item md={6} sm xs>
                                {this.props.login.data.role}
                            </Grid>
                        </Grid>
                    </Paper>
                </div>



                {/* <div style={{ margin: "2%" }}>
                    <h1>Profile</h1>
                    <Table className = {classes.tableStyle}>
                        <TableRow>
                            <TableCell>First name</TableCell>
                            <TableCell>{this.props.login.data.firstName}</TableCell>
                            
                        </TableRow>
                        <TableRow>
                            <TableCell>Last name</TableCell>
                            <TableCell>{this.props.login.data.lastName}</TableCell>
                         
                        </TableRow>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>{this.props.login.data.email}</TableCell>
                            
                        </TableRow>
                        <TableRow>
                            <TableCell>DOB</TableCell>
                            <TableCell>{this.props.login.data.dob}</TableCell>
                          
                        </TableRow>
                        <TableRow>
                            <TableCell>Designation</TableCell>
                            <TableCell>{this.props.login.data.designation}</TableCell>
                            
                        </TableRow>
                        <TableRow>
                            <TableCell>Role</TableCell>
                            <TableCell>{this.props.login.data.role}</TableCell>
                            
                        </TableRow>
                    </Table>
                </div> */}
            </React.Fragment>
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
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Profile));