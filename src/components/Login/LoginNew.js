import React from 'react';
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from './loginAction';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import AHILogo from './AHI_Logo.png';

const styles = theme => ({
  // layout: {
  //   width: 'auto',
  //   display: 'block', // Fix IE11 issue.
  //   marginLeft: theme.spacing.unit * 3,
  //   marginRight: theme.spacing.unit * 3,
  //   [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
  //     width: 400,
  //     marginLeft: 'auto',
  //     marginRight: 'auto',
  //   },
  // },
  layout:{
    width:'350px',
    position: 'fixed',
    top: '50%',
    left:' 50%',
    transform: 'translate(-50%, -50%)',
    // position: 'fixed',
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    // margin: 'auto',
  },
  paper: {
    // marginTop: theme.spacing.unit * 8,
    // display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});




class SignIn extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      username: "",
      password:""
    }
    
  }
  handleChange = (e) =>{       
    this.setState({ [e.target.name]: e.target.value })
  }
  handleSubmit = (event) => {
    event.preventDefault();
    // console.log("this.props.login.isAuthenticated",this.props.login.isAuthenticated);
      this.props.actions.login(this.state)
      
      // return <Redirect to="http://localhost:3000/#/ahits/home" push />
    }
  render(){
    const { classes,login } = this.props;
    // console.log(this.props.login)
    if(this.props.login.isAuthenticated == true){
        // console.log("redirecting to homepage....")
        return <Redirect to="/app/home" push />
      }
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            {/* <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar> */}
            <img className = "ahi-login-page-logo"  src={AHILogo} width="50%"  alt="ahi-logo" />
            <Typography component="h2" variant="display6" >
              Sign in
            </Typography>
            
            <form className={classes.form} autoComplete="off" onSubmit={this.handleSubmit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="username">User id</InputLabel>
                <Input id="username" name="username" autoComplete="username" autoFocus
                onChange={this.handleChange.bind(this)} 
                value={this.state["username"]} />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.handleChange.bind(this)} 
                    value={this.state["password"]}
                />
              </FormControl>
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button style={{marginTop : "15%"}}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign in
              </Button>
              <Typography component="h4" variant="display6"  style={{color:"red", marginTop :"2%"}} >
              {this.props.login.hasError ? "Please enter valid credentials" : ""}
            </Typography>
            </form>
          </Paper>
        </main>
      </React.Fragment>
    );
  }
  }

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};
function mapStateToProps(state){
  return {
      login: state.login
  }
}

function mapDispatchToProps(dispatch){
  return {
      actions: bindActionCreators({...ActionCreators}, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SignIn));
