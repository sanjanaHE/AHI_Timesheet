import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uuid from "uuid";
import * as ActionCreators from './timesheetAction';
import * as TaskActionCreators from './../Task/taskAction';
import * as ProjectActionCreators from './../Project/projectAction'
import * as LoginActionCreators from './../Login/loginAction'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Header from './../Header/Header';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import momentTZ from 'moment-timezone' //moment-timezone
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography/Typography';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icon from '@material-ui/core/Icon';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

const moment = extendMoment(Moment);
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
        backgroundColor: "#E65100"
    },
    duplAlertSnackbar: {
        backgroundColor: "#D50000"
    },
    timesheetHeader: {
        "margin-bottom": "2%", "background": "#BDBDBD", fontWeight: "bold"
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
    }
});

class Timesheet extends Component {
    constructor(props) {
        super(props)
        const today = moment()
        this.state = {
            tasks: [],
            errors: {},
            errorColor: {},
            gotDates: false,
            endDate: today,
            timesheet: [],
            selectedDatesRange: [],
            submitSuccessSnackBar: false
        }
    }

    updateDateRangeBasedOnSelectedDate = (selectedDate) => {
        let endDate = selectedDate.clone();
        let dateRange = [], n = 6
        dateRange.push(selectedDate.format("YYYY-MM-DD"))
        while (n > 0) {
            selectedDate.subtract(1, "day")
            dateRange.push(selectedDate.format("YYYY-MM-DD"))
            n--;
        }
        dateRange = dateRange.reverse();
        this.props.actions.getTimesheetEntries(this.props.login.data.id,
            selectedDate.format('DD-MM-YYYY'),
            endDate.format('DD-MM-YYYY'));
        this.setState({ endDate: endDate, selectedDatesRange: dateRange, startDate: selectedDate })
    }

    componentDidMount() {
        this.props.login_actions.getLoggedUser();
        this.props.project_actions.getProjects();
        this.updateDateRangeBasedOnSelectedDate(this.state.endDate);
        if (this.props.login.data.length != 0) {
            this.props.task_actions.getTasks(this.props.login.data.id);
            this.setState({ tasks: this.props.tasks.data })
        }
    }

    componentWillUnmount() {
        this.setState({ timesheet: [] })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.login.data.length == 0) {
            this.props.task_actions.getTasks(nextProps.login.data.id);
            this.props.actions.getTimesheetEntries(nextProps.login.data.id,
                this.state.startDate.format('DD-MM-YYYY'),
                this.state.endDate.format('DD-MM-YYYY'));
        }
        // console.log("received tasks!!!", nextProps)
        this.setState({ timesheet: nextProps.timesheet.data, tasks: nextProps.tasks.data })

    }

    renderProjects(rowId, activeProject) {
        return (
            <Grid item sm={2} md={2} xs={2}>
                <FormControl fullWidth style={{ height: "100%" }} required error={this.state.errors.hasOwnProperty(`${rowId}`) && this.state.errors[rowId].hasOwnProperty('projectId')}>

                    <Select
                        style={{ marginTop: "9%", height: "40%" }}
                        label="Projects"
                        fullWidth
                        input={
                            <OutlinedInput
                                labelWidth={this.state.labelWidth}
                                name="projectId"
                                id="projectId"
                            />
                        }
                        onChange={(e) => this.handleChangeTaskAndProjectName(e, rowId)}
                        value={activeProject}>
                        <MenuItem disabled value='' selected>
                            <em>Select</em>
                        </MenuItem>
                        {
                            this.props.projects.data.map(element => {
                                return <MenuItem  key={element.projectId} value={element.projectId}>{element.projectName}</MenuItem>
                            })
                        }
                    </Select>
                    {this.state.errors.hasOwnProperty(`${rowId}`) && this.state.errors[rowId].hasOwnProperty('projectId') ?
                        <FormHelperText>This field is required</FormHelperText> :
                        <FormHelperText></FormHelperText>}
                </FormControl>
            </Grid>)
    }

    renderTasks(rowId, activeTask) {
        // console.log("active tasks ", activeTask)
        return (<Grid item sm={2} md={2} xs={2}>
            <FormControl fullWidth style={{ height: "100%" }} required error={this.state.errors.hasOwnProperty(`${rowId}`) && this.state.errors[rowId].hasOwnProperty('taskId')}>

                <Select
                    style={{ marginTop: "9%", height: "40%" }}
                    label="Tasks"
                    fullWidth
                    input={
                        <OutlinedInput
                            labelWidth={this.state.labelWidth}
                            name="taskId"
                            id="taskId"
                        />
                    }
                    onChange={(e) => this.handleChangeTaskAndProjectName(e, rowId)}
                    value={activeTask}
                >
                    <MenuItem disabled value="select" selected>
                        <em>Select</em>
                    </MenuItem>
                    {
                        this.state.tasks.map(element => {
                            return (
                                <MenuItem key={element.taskId} value={element.taskId}>{element.taskName}</MenuItem>
                            );
                        })
                    }
                </Select>
                {/* {this.state.errors} */}
                {this.state.errors.hasOwnProperty(`${rowId}`) && this.state.errors[rowId].hasOwnProperty('taskId') ?
                    <FormHelperText>This field is required</FormHelperText> :
                    null}
            </FormControl>
        </Grid>)
    }

    handleChangeHours = (e, timesheetEntry) => {
        let timesheet = Object.assign([], this.state.timesheet);
        // console.log(timesheetEntry)

        for (let i = 0; i < timesheet.length; i++) {
            // if (timesheet[i].projectName === timesheetEntry.projectName
            //     && timesheet[i].taskName === timesheetEntry.taskName) {
            // console.log(timesheet[i].rowId ,"==", timesheetEntry.hasOwnProperty(rowId));
            if (timesheet[i].rowId == timesheetEntry.rowId) {
                // console.log(timesheet[i].rowId, "==", timesheetEntry.rowId);
                timesheet[i].timesheetEnteries[timesheetEntry.date] = timesheetEntry
                timesheet[i].timesheetEnteries[timesheetEntry.date]['totalHours'] = e.target.value
            }
        }
        this.setState({ timesheet: timesheet })
    }
    handleDeleteRow(rowId) {

        let timesheet = Object.assign([], this.state.timesheet);
        // console.log("handling delete ", timesheet)
        timesheet.forEach((element, index) => {
            if (element.rowId == rowId) {
                // console.log(element.rowId, " ==", rowId)
                // console.log("deleting....",timesheet[rowId])
                timesheet.splice(index, 1)
            }
        })
        this.setState({ timesheet: timesheet })
        // console.log(timesheet)
    }
    handleChangeTaskAndProjectName = (e, rowId) => {
        // console.log("in change taskName,projectname ", e.target.value, rowId);
        // console.log("state --- ", this.state.timesheet);
        let timesheet = Object.assign([], this.state.timesheet);
        let taskId, projectId;
        //validation for duplicate task name and project name pairs
        for (let i = 0; i < timesheet.length; i++) {
            if (timesheet[i].rowId == rowId) {
                if (e.target.name == 'taskId') {
                    taskId = e.target.value;
                    projectId = timesheet[i].projectId
                } else {
                    taskId = timesheet[i].taskId
                    projectId = e.target.value;
                }
            }
        }
        for (let i = 0; i < timesheet.length; i++) {
            //check if duplicate entry exists
            if (timesheet[i].rowId != rowId &&
                timesheet[i].projectId == projectId
                && timesheet[i].taskId == taskId) {
                // console.log('RAISE ERROR')
                this.setState({ submitAlertSnackBar: true })

                return;
            }
        }

        // console.log('REACHED HERE')
        for (let i = 0; i < timesheet.length; i++) {
            // console.log(timesheet[i].rowId , "__",timesheet[i].projectName,"___",timesheet[i].taskName)
            if (timesheet[i].rowId == rowId) {
                timesheet[i][e.target.name] = e.target.value;
            }

            // since entries are {{},{},{}} ==> get keys and its values
            for (var key in timesheet[i].timesheetEnteries) {
                if (timesheet[i].timesheetEnteries.hasOwnProperty(key)) {
                    // console.log(key , " -> " , timesheet[i].timesheetEnteries[key]);
                    if (timesheet[i].rowId == rowId) {
                        timesheet[i].timesheetEnteries[key][e.target.name] = e.target.value
                    }
                }
            }
        }
        this.setState({ timesheet: timesheet })
        this.handleValidation()
        // console.log(timesheet)

    }
    renderTimesheetInput(timesheetEntry) {
        // console.log("in render timesheet input ",timesheetEntry.totalHours)
        if (timesheetEntry.totalHours == null) timesheetEntry.totalHours = 0;
        else if (timesheetEntry.totalHours < 0 || timesheetEntry.totalHours > 9) timesheetEntry.totalHours = 0;
        return (
            <React.Fragment>
                <Grid item sm={1} xs={1} md={1}>
                    <TextField
                        style={{ height: "40%" }}
                        id="totalHours"
                        // label={timesheetEntry?moment(timesheetEntry.date).format('DD-MM-YYYY'):null}
                        type="number"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        inputProps={{ maxLength: 1, min: 0, max: 9, minlength: 1 }}

                        onChange={(e) => this.handleChangeHours(e, timesheetEntry)}
                        value={timesheetEntry ? timesheetEntry.totalHours : 0}
                    />
                </Grid>
            </React.Fragment>)
    }
    deleteRow(rowId) {
        // console.log(rowId)
        return (
            <Grid item sm={1} xs md={1} alignItems="center" justify="center" style={{ "margin-top": "1%" }} >
                <IconButton aria-label="Delete" onClick={() => this.handleDeleteRow(rowId)}>
                    <DeleteIcon style={{ "color": "red" }} fontSize="small" />
                </IconButton>
            </Grid>
        )
    }

    dateCheck(rowId, project, task, timesheet) {
        return this.state.selectedDatesRange.map(timesheetDate => {
            // var m = momentTZ.tz(date + 'T00:00:00.000', 'Asia/Kolkata');
            // let timesheetDate = m.utc().format('YYYY-MM-DDTHH:mm:ss.000+0000');
            if (timesheet.hasOwnProperty(timesheetDate)) {
                timesheet[timesheetDate]['rowId'] = rowId;
                return this.renderTimesheetInput(timesheet[timesheetDate])
            } else {
                return this.renderTimesheetInput({
                    rowId: rowId,
                    date: timesheetDate, projectId: project,
                    taskId: task, empId: this.props.login.data.id
                })
            }
        })
    }

    renderRow(isRowDeletable, rowId, project, task, timesheet) {
        // console.log("timesheet in render row",timesheet)
        return (<Grid container spacing={24} style={{ margin: "0 3% -3% -1%", paddingLeft: "1%" }}>
            {this.renderProjects(rowId, project)}
            {this.renderTasks(rowId, task)}
            {/* // Generate an array of dates from startDate to endDate
            // Iterate over the array of dates, If the value exists then render timesheet input
            // Else
            // Render empty timesheet input */}

            {this.dateCheck(rowId, project, task, timesheet)}

            {isRowDeletable ? this.deleteRow(rowId) : null}

            {/* for duplicate entry alert */}
            <Dialog
                        open={this.state.submitAlertSnackBar}
                        onClose={this.handleCloseDupAlertSnackBar}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        {/* <DialogTitle id="alert-dialog-title">Warning!</DialogTitle> */}
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                You are trying to enter duplicate entry!
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            {/* <Button onClick={this.handleCloseDupAlertSnackBar} color="primary">
                                No
                            </Button> */}
                            <Button onClick={this.handleCloseDupAlertSnackBar} color="primary" autoFocus>
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>

            {/* <Snackbar key = "duplicate entry"
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={this.state.submitAlertSnackBar}
                autoHideDuration={1500}
                disableWindowBlurListener = "true"
                onClose={this.handleCloseSnackBar}
                ContentProps={{
                    'aria-describedby': 'message-id',
                    classes: {
                        root: this.props.classes.duplAlertSnackbar
                    }
                }}
                message={
                    <span id="message-id" className={this.props.classes.message}>
                        <ErrorIcon className={classNames(this.props.classes.icon, this.props.classes.iconVariant)} />
                        Duplicate entry</span>}
                action={[

                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        className={this.props.classes.close}
                        onClick={this.handleCloseAlertSnackBar}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            /> */}
        </Grid>)
    }
    handleValidation() {
        // console.log(this.state.timesheet)
        let errors = {};    //error messages
        let errorColor = {}; //true/false
        let formIsValid = true;
        let rowErrors = {};
        this.state.timesheet.forEach(element => {
            // console.log("each element ", element)

            // if(element.rowId != this.state.rowId && 
            //     element.projectName == this.state.projectName &&
            //     element.taskName == this.state.taskName){
            //         console.log("projectname task name repeating")
            // }
            if ((element.projectId == "null" || element.projectId == null) && (element.taskId == "null" || element.taskId == null)) {
                // Object.assign(errorColor[element.rowId], {"taskName":true,"projectName":true});    //true for error(red color will appear)
                formIsValid = false;
                //following data structure => {2:{"projectName": "Invalid Project Name"}}
                errors[element.rowId] = {}
                Object.assign(errors[element.rowId], {
                    "projectId": "This field is required",
                    "taskId": "This field is required"
                });
            }
            else if (element.projectId == "null" || element.projectId == null) {
                // console.log(element.rowId, " is null");
                // Object.assign(errorColor[element.rowId], {"projectName":true});    //true for error(red color will appear)
                formIsValid = false;
                errors[element.rowId] = {}
                Object.assign(errors[element.rowId], { "projectId": "This field is required" });
            }
            else if (element.taskId == "null" || element.taskId == null) {
                // console.log(element, " is null");
                // Object.assign(errorColor[element.rowId],{"taskName":true});    //true for error(red color will appear)
                formIsValid = false;
                errors[element.rowId] = {}
                Object.assign(errors[element.rowId], { "taskId": "This field is required" });

            }
        })
        // console.log(errors)
        this.setState({ errors: errors });
        this.setState({ errorColor: errorColor });
        // console.log("ERRORs", this.state.errors)
        return formIsValid;
    }
    handleSubmitAction = () => {
        // console.log("before timesheet submit--- ", this.state.timesheet)
        if (this.handleValidation()) {
            this.props.actions.saveTimesheetEntries(this.state.timesheet)
            this.setState({ submitSuccessSnackBar: true })

            let timesheet = Object.assign([], this.state.timesheet);
            timesheet.forEach(element => {
                element.isRowDeletable = false;
            })
            this.setState({ timesheet: timesheet })
        }
    }

    handleCloseSnackBar = () => {

        this.setState({ submitSuccessSnackBar: false })
    }
    handleCloseDupAlertSnackBar = () => {
        this.setState({ submitAlertSnackBar: false })
    }
    handleMovePrevWeek = () => {
        let endDate = this.state.endDate.subtract(7, "day")
        this.updateDateRangeBasedOnSelectedDate(endDate)
    }
    handleMoveNextWeek = () => {
        let endDate;
        // let prevCurDate = this.state.endDate.subtract(1, "day")
        // let curDate = moment();
        // console.log("end date ",this.state.endDate)
        // console.log("current date",moment())
        // console.log(curDate.isSame(prevCurDate))
        // // console.log(curDate.isAfter(this.state.endDate))
        // // console.log(moment().isAfter(this.state.endDate))
        // if(curDate.isAfter(this.state.endDate)){
        //     console.log("enough faking entries!!")
        // }
        //  else{
        endDate = this.state.endDate.add(7, "day")
        this.updateDateRangeBasedOnSelectedDate(endDate)
        // }
    }
    handleAddRowAction = () => {
        // console.log(this.state.timesheet.length)
        this.setState({ timesheet: [...this.state.timesheet, { isRowDeletable: true, rowId: uuid.v4(), projectId: null, taskId: null, timesheetEnteries: {} }] })
    }
    render() {
        const { classes } = this.props;
        // console.log(this.props)
        // console.log(this.state)
        return (
            <React.Fragment>
                {/* <Header></Header> */}
                <div style={{ margin: "2%", "background": "whitesmoke" }}>
                    <h1>Timesheet</h1>
                    <Grid container spacing={8} style={{ "margin-bottom": "2%" }}>
                        <Grid item md={2} sm={2} xs={2}>
                            {/* <Button variant="contained" color="secondary" onClick={this.handleAddRowAction}> <AddIcon /> Add Row</Button> */}
                            <Tooltip title="Add row">
                                <Button variant="fab" color="secondary" aria-label="Add" onClick={this.handleAddRowAction} >
                                    <AddIcon />
                                </Button>
                            </Tooltip>
                        </Grid>
                        <Grid item md={1} sm={1} xs={1}>
                        </Grid>
                        <Grid item md={2} sm={2} xs={2}>
                            <Button variant="contained" color="primary" onClick={this.handleMovePrevWeek}>
                                {/* <FontAwesomeIcon icon="arrow-left" />  */}
                                {/* <Icon className="fa fa-plus-circle"/> */}
                                Previous </Button>
                        </Grid>
                        <Grid item md={2} sm={2} xs={2}>
                            <Button variant="outlined" color="primary" disabled>
                                {this.state.startDate != undefined ? this.state.startDate.format('DD/MM/YYYY') : null} -
                                {this.state.endDate.format('DD/MM/YYYY')}
                            </Button>
                        </Grid>
                        <Grid item md={2} sm={2} xs={2}>
                            <Button variant="contained" color="primary"
                                disabled={this.state.endDate.diff(moment(), 'day') >= 0 ? true : false}
                                onClick={this.handleMoveNextWeek}> Next </Button>
                        </Grid>
                    </Grid>
                    <Grid container className={classes.timesheetHeader}>
                        <Grid item sm={2} md={2} xs={2}>
                            <Typography variant="subheading">Projects</Typography>
                        </Grid>
                        <Grid item sm={2} md={2} xs={2}>
                            <Typography variant="subheading">Tasks</Typography>
                        </Grid>
                        {this.state.selectedDatesRange.map(date => {
                            return (<Grid item sm={1} xs={1} md={1}>
                                <Typography variant="subheading">{moment(date).format('DD MMM')}</Typography>
                                <Typography variant="subheading">{moment(date).format('ddd')}</Typography>

                            </Grid>);
                        })}
                    </Grid>

                    {this.state.timesheet.length > 0 ?
                        this.state.timesheet.map((ele, index) => {
                            // console.log("timesheet entries",ele.timesheetEnteries)
                            return this.renderRow(ele.isRowDeletable, ele.rowId, ele.projectId, ele.taskId, ele.timesheetEnteries)
                        }) : null}
                    <Button variant="contained" color="primary"
                        onClick={this.handleSubmitAction}
                        style={{ "margin-top": "2%" }}>Submit</Button>
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    open={this.state.submitSuccessSnackBar}
                    autoHideDuration={1500}
                    onClose={this.handleCloseSnackBar}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                        classes: {
                            root: classes.successSnackbar
                        }
                    }}
                    message={
                        <span id="message-id" className={classes.message}>
                            <CheckCircleIcon className={classNames(classes.icon,classes.iconVariant)} />
                            Successfully submitted timesheet</span>}
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
            </React.Fragment>
        )
    }
}
function mapStateToProps(state) {
    return {
        timesheet: state.timesheet,
        tasks: state.tasks,
        projects: state.projects,
        login: state.login
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...ActionCreators }, dispatch),
        project_actions: bindActionCreators(ProjectActionCreators, dispatch),
        task_actions: bindActionCreators(TaskActionCreators, dispatch),
        login_actions: bindActionCreators(LoginActionCreators, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Timesheet));