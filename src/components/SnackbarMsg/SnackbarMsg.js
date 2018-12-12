import React, { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from './snackbarMsgAction';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
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
    successSnackbar: {
        // backgroundColor: "#4CAF50"
        backgroundColor: theme.palette.secondary.main
    },
    errorSnackbar: {
        backgroundColor: theme.palette.primary.error
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});
class SnackbarMsg extends Component {
    constructor(props){
        super(props);
        this.state = {
            submitSuccessSnackBar: false
        }
    }
    handleCloseSnackBar = () => {
        this.props.actions.clearMessage()
    }
  render() {
      const { classes } = this.props;
    //   console.log(this.props.snackbarMsg)
    return (
        this.props.snackbarMsg.length > 0 ?
        <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={()=>{this.setState({submitSuccessSnackBar:true})}}
                    autoHideDuration={1500}
                    onClose={this.handleCloseSnackBar}
                    
                    ContentProps={
                        this.props.snackbarMsg[0].error==true ?{
                            'aria-describedby': 'message-id',
                            classes: {
                                root: classes.errorSnackbar
                            }
                        }:
                        {'aria-describedby': 'message-id',
                            classes: {
                                root: classes.successSnackbar
                            }
                        }
                    }
                    message={this.props.snackbarMsg[0].error==true ?
                                <span id="message-id" className={classes.message}>
                                <ErrorIcon className={classNames(classes.icon,classes.iconVariant)} />
                                {this.props.snackbarMsg[0].message}</span>
                                :
                                <span id="message-id" className={classes.message}>
                                <CheckCircleIcon className={classNames(classes.icon,classes.iconVariant)} />
                                {this.props.snackbarMsg[0].message}</span>
                            }
                    action={[

                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                className={classes.close}
                                onClick={this.handleCloseSnackBar}
                            >
                                <CloseIcon />
                            </IconButton>,
                        ]}
                />
                : null
    )
  }
}
function mapStateToProps(state) {
    return {
        snackbarMsg: state.snackbarMsg
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...ActionCreators }, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)((SnackbarMsg)));;
