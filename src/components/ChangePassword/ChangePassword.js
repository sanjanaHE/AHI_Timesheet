import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import trim from 'trim'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import * as LoginActionCreators from './../Login/loginAction';
import * as ChangePasswordActionCreators from './changePasswordAction';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import Snackbar from '@material-ui/core/Snackbar';
import green from '@material-ui/core/colors/green';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper/Paper';


var errorMessage, successMessage, message = "";
var color;
const styles = theme => ({
    successSnackbar: {
        backgroundColor: theme.palette.secondary.main
    },
    errorSnackbar: {
        backgroundColor: theme.palette.primary.error
    },
});
class ChangePassword extends Component {

    componentWillReceiveProps(nextProps) {
        // console.log("NEXT PROPS ", nextProps)
        // if (nextProps.changePassword.pending == true) {
        if (nextProps.changePassword.pending == false
            && nextProps.changePassword.hasError == true) {
            message = "Failed to change password";
            this.setState({ showSnackBar: true, error: true })
            this.handleReset();
        }
        else if (nextProps.changePassword.pending == false
            && nextProps.changePassword.hasError == false) {
            message = "Successfully changed password";
            this.setState({ showSnackBar: true, error: false })
            this.handleReset();
        }
        // }
    }
    handleChange = (e) => {
        let fields = this.state.fields;
        fields[e.target.name] = e.target.value;
        this.setState({ fields });
        // console.log(this.state.fields)

        //setting errors and errorcolor in state
        let errorColor = this.state.errorColor;
        let errors = this.state.errors;

        if (fields[e.target.name] == '') {
            errorColor[e.target.name] = true;
            errors[e.target.name] = "This field is required";
            this.setState({ errorColor: errorColor, errors: errors })
        }
        else {
            // console.log(e.target);
            errorColor[e.target.name] = false;
            errors[e.target.name] = "";
            this.setState({ errorColor: errorColor, errors: errors })
        }
    }

    componentDidMount() {
        this.props.actions.resetPasswordState();
    }
    constructor(props) {
        super(props)
        this.state = {
            fields: {},
            errorColor: {},
            errors: {},

        }

    }
    handleValidation() {

        let fields = this.state.fields;
        let errors = {};    //error messages
        let errorColor = {}; //true/false
        let formIsValid = true;

        if (!fields["oldPassword"]) {
            errorColor["oldPassword"] = true;    //true for error(red color will appear)
            formIsValid = false;
            errors["oldPassword"] = "This field is required";

        }
        else if (trim(fields["oldPassword"]) == '') {
            errorColor["oldPassword"] = true;
            formIsValid = false;
            errors["oldPassword"] = "Please enter valid password";
        }
        if (!fields["newPassword"]) {
            errorColor["newPassword"] = true;    //true for error(red color will appear)
            formIsValid = false;
            errors["newPassword"] = "This field is required";

        }
        else if (trim(fields["newPassword"]) == '') {
            errorColor["newPassword"] = true;
            formIsValid = false;
            errors["newPassword"] = "Please enter valid password";
        }
        if (!fields["confirmPassword"]) {
            errorColor["confirmPassword"] = true;    //true for error(red color will appear)
            formIsValid = false;
            errors["confirmPassword"] = "This field is required";

        }
        else if (trim(fields["confirmPassword"]) == '') {
            errorColor["confirmPassword"] = true;
            formIsValid = false;
            errors["confirmPassword"] = "Please enter valid password";
        }
        else if (trim(fields["confirmPassword"]) != trim(fields["newPassword"])) {
            errorColor["confirmPassword"] = true;
            formIsValid = false;
            errors["confirmPassword"] = "Confirm password and new password should be same";
        }
        else if (trim(fields["confirmPassword"]) == trim(fields["oldPassword"])) {
            errorColor["confirmPassword"] = true;
            formIsValid = false;
            errors["confirmPassword"] = "Password should not be same as old password";
        }


        this.setState({ errors: errors });
        this.setState({ errorColor: errorColor });
        return formIsValid;
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.handleValidation()) {
            // console.log("valid", this.props.actions);
            this.props.actions.changePassword(this.state.fields.oldPassword, this.state.fields.newPassword);
            // console.log(this.props.changePassword)
            // if((this.state.apiError == true) && (this.props.changePassword.pending == true)){
            //     alert("error")
            //     // console.log("has error")

            // }   
            // else if((this.state.apiError == false) && (this.props.changePassword.pending == true)){
            //     // console.log("no  error")

            //     alert("password changed")
            // }
            // else if(this.props.changePassword.pending == false)
            //  alert("PENDING")
        }

    }

    handleReset = () => {
        var fields = { ...this.state.fields };
        fields.oldPassword = "";
        fields.newPassword = "";
        fields.confirmPassword = "";
        this.setState({ fields })
        this.props.actions.resetPasswordState();
    }
    handleCloseSnackBar = () => {
        this.setState({ showSnackBar: false })
    }
    render() {
        const { classes } = this.props;
        // console.log(this.props)
        return (
            <div style={{ margin: "2%" }}>
                <h1>Change Password</h1>
                <Paper style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
                    <div style={{ margin: "5% 5% 5% 5%" }}>
                        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                            <TextField
                                required
                                autoFocus
                                margin="dense"
                                id="oldPassword"
                                name="oldPassword"
                                label="Old Password"
                                type="password"
                                fullWidth
                                onChange={this.handleChange.bind(this)}
                                value={this.state.fields["oldPassword"]}
                                error={this.state.errorColor.oldPassword}
                                helperText={this.state.errors.oldPassword}
                            />
                            <TextField
                                required
                                margin="dense"
                                id="newPassword"
                                name="newPassword"
                                label="New Password"
                                type="password"
                                fullWidth
                                onChange={this.handleChange.bind(this)}
                                value={this.state.fields["newPassword"]}
                                error={this.state.errorColor.newPassword}
                                helperText={this.state.errors.newPassword}
                            />
                            <TextField
                                required
                                margin="dense"
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirm new password"
                                type="password"
                                fullWidth
                                onChange={this.handleChange.bind(this)}
                                value={this.state.fields["confirmPassword"]}
                                error={this.state.errorColor.confirmPassword}
                                helperText={this.state.errors.confirmPassword}
                            />
                            <Grid container spacing={24} style={{ "margin-top": "6%" }}>
                                <Grid item md={2} sm={4} xs={4}>
                                    <Button variant="contained" color="primary" onClick={this.handleReset}>Reset</Button>

                                </Grid>
                                <Grid item md={2} sm xs>
                                    <Button variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
                                </Grid>
                            </Grid>
                            {/* {error} */}
                            {/* <p style={{ "color": "#4CAF50" }}>{successMessage}</p>
                        <p style={{ "color": "#F44336" }}>{errorMessage}</p> */}
                            {/* {error ?<p style={{"color":"#4CAF50"}}>{successMessage}</p> : <p style={{"color":"#F44336"}}>{errorMessage}</p>} */}

                            <Snackbar
                                // className={classes.successSnackbar}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                open={this.state.showSnackBar}
                                autoHideDuration={1500}
                                onClose={this.handleCloseSnackBar}

                                ContentProps={
                                    this.state.error == true ? {
                                        'aria-describedby': 'message-id',
                                        classes: {
                                            root: classes.errorSnackbar
                                        }
                                    } :
                                        {
                                            'aria-describedby': 'message-id',
                                            classes: {
                                                root: classes.successSnackbar
                                            }
                                        }
                                }

                                message={<span id="message-id">{message}</span>}
                                action={[

                                    <IconButton
                                        key="close"
                                        aria-label="Close"
                                        color="inherit"
                                        // className={classes.close}
                                        onClick={this.handleCloseSnackBar}
                                    >
                                        <CloseIcon />
                                    </IconButton>,
                                ]}
                            />
                        </form>
                    </div>
                </Paper>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        login: state.login,
        changePassword: state.changePassword
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...ChangePasswordActionCreators }, dispatch),
        login_actions: bindActionCreators(LoginActionCreators, dispatch)

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)((ChangePassword)));
