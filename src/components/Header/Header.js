import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link,NavLink } from 'react-router-dom';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

import * as LoginActionCreators from './../Login/loginAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from "./infotech.png";

const styles = theme =>({
    root: {
        flexGrow: 1,
    },
    grow: {
        display:'flex',
        flexGrow:1,
        [theme.breakpoints.up('md')]: {
            display:'block',
            flexGrow:1,
        }
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    toolbar: {
        // display:'flow-root',
        display: 'flex',
        overflowX: 'scroll',
        [theme.breakpoints.up('md')]: {
          display: 'flex',
          minHeight:"55px",
          overflowX: 'hidden',
        },
      },
    active:{
        color:'red',
        textDecoration:"blink"
    },
    head:{
        color:'whitesmoke',
        textDecoration:"blink"
    }
});

class ButtonAppBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            anchorE2:null
        };
    }
    componentDidMount() {
        this.props.login_actions.getLoggedUser();
    }
    handleMenu = event => {
        // console.log(event.currentTarget)
        // console.log(this.state.anchorEl)
        this.setState({ anchorEl: event.currentTarget });
    };
    handleMenuAH = event => {
        // console.log(event.currentTarget)
        // console.log(this.state.anchorEl)
        this.setState({ anchorE2: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: false });
    };
    handleCloseAH = () => {
        this.setState({ anchorE2: false });
    };
    render() {
        const { anchorEl,anchorE2 } = this.state;
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar className = {classes.toolbar} variant="dense">
                    {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton> */}
                    <img src={Logo} height="45" alt="ah-logo" />
                    <React.Fragment>
                        <Typography variant="subheading" color="inherit" >
                            <Button>
                                <Link to="/app/home/" className={classes.head}> Home</Link>
                                {/* <NavLink to="/app/home/" activeClassName={classes.active} inactiveClassName={classes.inactive}>Home</NavLink> */}
                            </Button>
                      
                        </Typography>
                        <Typography variant="subheading" color="inherit" >
                            <Button>
                                <Link to="/app/timesheet/" className={classes.head}> Timesheet</Link>
                            </Button>
                        </Typography>
                        <Typography variant="subheading" color="inherit" >
                            <Button
                                className={classes.head}
                                aria-owns={anchorE2 ? 'menu' : null}
                                aria-haspopup="true"
                                onClick={this.handleMenuAH} >My AH
                            </Button>
                        </Typography>
                        <Menu
                            id="menu"
                            anchorEl={anchorE2}
                            open={Boolean(anchorE2)}
                            onClose={this.handleCloseAH}
                            className={classes.head}>
                            <MenuItem component={Link} to="/app/task" onClick={this.handleCloseAH}>Task</MenuItem>
                            <MenuItem component={Link} to="/app/profile" onClick={this.handleCloseAH}>Profile</MenuItem>
                        </Menu>
                        {/* admin section access restricted to user */}
                        {this.props.login.data.role == "admin" ? (
                            <Typography variant="subheading" color="inherit" >
                            <Button
                               className={classes.head}
                                aria-owns={anchorEl ? 'simple-menu' : null}
                                aria-haspopup="true"
                                onClick={this.handleMenu} >Admin
                            </Button>
                        </Typography>) :null
                        }
                        
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this.handleClose}
                            className={classes.head}>
                            <MenuItem component={Link} to="/app/admin/department" onClick={this.handleClose}>Department</MenuItem>
                            <MenuItem component={Link} to="/app/admin/employee" onClick={this.handleClose}>Employees</MenuItem>
                            <MenuItem component={Link} to="/app/admin/project" onClick={this.handleClose}>Project</MenuItem>
                            <MenuItem component={Link} to="/app/admin/client" onClick={this.handleClose}>Client</MenuItem>

                        </Menu>
                        <Typography align="right" variant="subheading" color="inherit" className={classes.grow}>
                            <Button disabled>
                               <span className={classes.head}>Welcome {this.props.login.data.firstName}</span>
                            </Button>
                            <Button>
                               <Link to="/app/changePassword/" className={classes.head}> Change Password</Link>
                            </Button>
                            <Button>
                               <Link to="/auth/logout/" className={classes.head}> Logout</Link>
                            </Button>
                        </Typography>
                        </React.Fragment>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ButtonAppBar));
