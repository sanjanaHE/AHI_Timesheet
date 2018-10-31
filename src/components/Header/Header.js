import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

import * as LoginActionCreators from './../Login/loginAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 2,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    //   menu:{
    //       bg:{
    //           color:'white'
    //       }
    //   }
};

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
                    <Toolbar>
                    {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                        <MenuIcon />
                    </IconButton> */}
                        <Typography variant="subheading" color="inherit" className={classes.grow}>
                            <Button>
                                <Link to="/home/" style={{ "color": "white" ,"textDecoration":"blink"}}> Home</Link>
                            </Button>
                      
                        </Typography>
                        <Typography variant="subheading" color="inherit" className={classes.grow}>
                            <Button>
                                <Link to="/timesheet/" style={{ "color": "white" ,"textDecoration":"blink"}}> Timesheet</Link>
                            </Button>
                        </Typography>

                        <Typography variant="subheading" color="inherit" className={classes.grow}>
                            <Button
                                style={{ "color": "white" }}
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
                            style={{ color: 'white' }}>
                            <MenuItem component={Link} to="/task" onClick={this.handleCloseAH}>Task</MenuItem>
                            <MenuItem component={Link} to="/profile" onClick={this.handleCloseAH}>Profile</MenuItem>
                        </Menu>
                        {this.props.login.data.role == "admin" ? (
                            <Typography variant="subheading" color="inherit" className={classes.grow}>
                            <Button
                                style={{ "color": "white" }}
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
                            style={{ color: 'white' }}>
                            <MenuItem component={Link} to="/department" onClick={this.handleClose}>Department</MenuItem>
                            <MenuItem component={Link} to="/employee" onClick={this.handleClose}>Employees</MenuItem>
                            <MenuItem component={Link} to="/project" onClick={this.handleClose}>Project</MenuItem>
                        </Menu>
                        <Typography variant="subheading" color="inherit" className={classes.grow}>
                            <Button>
                                <Link to="/logout/" style={{ "color": "white" ,"textDecoration":"blink"}}> Logout</Link>
                            </Button>
                        </Typography>
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
