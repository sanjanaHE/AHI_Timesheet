import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';
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
            anchorE2: null
        };
    }
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };
    handleClickMyAh = event => {
        this.setState({ anchorE2: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: false });
    };
    handleCloseMyAh = () => {
        this.setState({ anchorE2: false });
    }
    render() {
        const { anchorEl } = this.state;
        const { anchorE2 } = this.state;
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                      <Typography variant="subheading" color="inherit" className={classes.grow}>
                            Home
                  </Typography>
                        <Typography variant="subheading" color="inherit" className={classes.grow}>
                            Timesheet
                  </Typography>


                <Typography variant="subheading" color="inherit" className={classes.grow}>
                    <Button
                        style={{ "color": "white" }}
                        aria-owns={anchorE2 ? 'simple-menu' : null}
                        aria-haspopup="true"
                        onClick={this.handleClickMyAh} >My AH
                    </Button>
                </Typography>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorE2}
                            open={Boolean(anchorE2)}
                            onClose={this.handleCloseMyAh}
                            style={{ color: 'white' }}>
                            <MenuItem component={Link} to="/task" onClick={this.handleCloseMyAh}>Task</MenuItem>
                            <MenuItem component={Link} to="/profile" onClick={this.handleCloseMyAh}>Profile</MenuItem>
                        </Menu>


                <Typography variant="subheading" color="inherit" className={classes.grow}>
                    <Button
                        style={{ "color": "white" }}
                        aria-owns={anchorEl ? 'simple-menu' : null}
                        aria-haspopup="true"
                        onClick={this.handleClick} >Admin
                    </Button>
                </Typography>
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
                        <Button color="inherit">Logout</Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
