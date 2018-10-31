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
import FormControl from '@material-ui/core/FormControl';
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
        backgroundColor: green[600]
    }
});

class Timesheet extends Component {
    constructor(props) {
        super(props)
        const today = moment()
        this.state = {
            tasks:[],
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
            this.setState({tasks:this.props.tasks.data})
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
        console.log("received tasks!!!", nextProps)
        this.setState({ timesheet: nextProps.timesheet.data ,tasks : nextProps.tasks.data})

    }

    renderProjects(rowId, activeProject) {
        return (
            <Grid item sm={2} md={2} xs={2}>
                {/* <InputLabel htmlFor="projectId">Projects</InputLabel> */}
                <Select
                    style={{ marginTop: "9%", height: "40%" }}
                    fullWidth
                    autoWidth={true}
                    input={
                        <OutlinedInput
                            labelWidth={this.state.labelWidth}
                            name="projectName"
                            id="projectName"
                        />
                    }
                    onChange={(e) => this.handleChangeTaskAndProjectName(e, rowId)}
                    value={activeProject}>
                    <MenuItem disabled value="select" selected>
                        <em>Select</em>
                    </MenuItem>
                    {
                        this.props.projects.data.map(element => {
                            return <MenuItem value={element.projectName}>{element.projectName}</MenuItem>
                        })
                    }
                </Select>
            </Grid>)
    }

    renderTasks(rowId, activeTask) {
        return (<Grid item sm={2} md={2} xs={2}>
            {/* <FormControl fullWidth> */}
            {/* <InputLabel htmlFor="taskId">Tasks</InputLabel> */}
            <Select
                style={{ marginTop: "9%", height: "40%" }}
                label="Tasks"
                fullWidth
                // inputProps={{
                //     name: 'taskId',
                //     id: 'taskId',
                // }}
                input={
                    <OutlinedInput
                        labelWidth={this.state.labelWidth}
                        name="taskName"
                        id="taskName"
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
                        return <MenuItem value={element.taskName}>{element.taskName}</MenuItem>
                    })
                }
            </Select>
            {/* </FormControl> */}
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
        timesheet.forEach((element,index) => {
            if (element.rowId == rowId) {
                console.log(element.rowId," ==", rowId)
                // console.log("deleting....",timesheet[rowId])
                timesheet.splice(index,1)
            }
        })
        this.setState({ timesheet: timesheet })
        console.log(timesheet)
    }
    handleChangeTaskAndProjectName = (e, rowId) => {
        // console.log("in change taskName,projectname ", e.target.value);
        // console.log("state --- ", this.state.timesheet);
        let timesheet = Object.assign([], this.state.timesheet);
        for (let i = 0; i < timesheet.length; i++) {
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
        // console.log(timesheet)

    }
    renderTimesheetInput(timesheetEntry) {
        // console.log("in render timesheet input ",timesheetEntry.totalHours)
        if (timesheetEntry.totalHours == null) timesheetEntry.totalHours = 0;
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
                        inputProps={{ maxLength: 1, min: 0, max: 9 }}
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
        return this.state.selectedDatesRange.map(date => {
            var m = momentTZ.tz(date + 'T00:00:00.000', 'Asia/Kolkata');
            let timesheetDate = m.utc().format('YYYY-MM-DDTHH:mm:ss.000+0000');
            if (timesheet.hasOwnProperty(timesheetDate)) {
                timesheet[timesheetDate]['rowId'] = rowId;
                return this.renderTimesheetInput(timesheet[timesheetDate])
            } else {
                return this.renderTimesheetInput({
                    rowId: rowId,
                    date: timesheetDate, projectName: project,
                    taskName: task, empId: this.props.login.data.id
                })
            }
        })
    }

    renderRow(isRowDeletable, rowId, project, task, timesheet) {
        // console.log("timesheet in render row",timesheet)
        return (<Grid container spacing={24}>
            {this.renderProjects(rowId, project)}
            {this.renderTasks(rowId, task)}
            {/* // Generate an array of dates from startDate to endDate
            // Iterate over the array of dates, If the value exists then render timesheet input
            // Else
            // Render empty timesheet input */}

            {this.dateCheck(rowId, project, task, timesheet)}

            {isRowDeletable ? this.deleteRow(rowId) : null}
        </Grid>)
    }

    handleSubmitAction = () => {
        // console.log("in save ", this.state.timesheet)
        this.props.actions.saveTimesheetEntries(this.state.timesheet)
        this.setState({ submitSuccessSnackBar: true })

        let timesheet = Object.assign([], this.state.timesheet);
        timesheet.forEach(element => {
            element.isRowDeletable = false;
        })
        this.setState({ timesheet: timesheet })
    }

    handleCloseSnackBar = () => {
        this.setState({ submitSuccessSnackBar: false })
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
        console.log(this.state.timesheet.length)
        this.setState({ timesheet: [...this.state.timesheet, { isRowDeletable: true, rowId: uuid.v4(), projectName: null, taskName: null, timesheetEnteries: {} }] })
    }
    render() {
        const { classes } = this.props;
        // console.log(this.props)
        // console.log(this.state)
        return (
            <React.Fragment>
                <Header></Header>
                <div style={{ margin: "2%", "background": "whitesmoke" }}>
                    <h1>Timesheet</h1>
                    <Grid container spacing={8} style={{ "margin-bottom": "2%" }}>
                        <Grid item md={2} sm={2} xs={2}>
                            <Button variant="contained" color="primary" onClick={this.handleAddRowAction}> <AddIcon /> Add Row</Button>
                        </Grid>
                        <Grid item md={1} sm={1} xs={1}>
                        </Grid>
                        <Grid item md={2} sm={2} xs={2}>
                            <Button variant="contained" color="primary" onClick={this.handleMovePrevWeek}>
                                {/* <FontAwesomeIcon icon="arrow-left" />  */}
                                {/* <Icon className="fa fa-plus-circle"/> */}
                                Previous Week </Button>
                        </Grid>
                        <Grid item md={2} sm={2} xs={2}>
                            <Button variant="outlined" color="primary">
                                {this.state.startDate != undefined ? this.state.startDate.format('DD/MM/YYYY') : null} -
                                {this.state.endDate.format('DD/MM/YYYY')}
                            </Button>
                        </Grid>
                        <Grid item md={2} sm={2} xs={2}>
                            <Button variant="contained" color="primary"
                                disabled={this.state.endDate.diff(moment(), 'day') >= 0 ? true : false}
                                onClick={this.handleMoveNextWeek}> Next Week </Button>
                        </Grid>
                    </Grid>
                    <Grid container style={{ "margin-bottom": "2%", "background": "darkgray" }}>
                        <Grid item sm={2} md={2} xs={2}>
                            <Typography variant="subheading">Projects</Typography>
                        </Grid>
                        <Grid item sm={2} md={2} xs={2}>
                            <Typography variant="subheading">Tasks</Typography>
                        </Grid>
                        {this.state.selectedDatesRange.map(date => {
                            return (<Grid item sm={1} xs={1} md={1}>
                                <Typography variant="subheading">{moment(date).format('DD MMM')}</Typography>
                            </Grid>);
                        })}
                    </Grid>

                    {this.state.timesheet.length > 0 ?
                        this.state.timesheet.map((ele, index) => {
                            // console.log("timesheet entries",ele.timesheetEnteries)
                            return this.renderRow(ele.isRowDeletable, ele.rowId, ele.projectName, ele.taskName, ele.timesheetEnteries)
                        }) : null}
                    <Button variant="contained" color="primary"
                        onClick={this.handleSubmitAction}>Submit</Button>
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={this.state.submitSuccessSnackBar}
                    autoHideDuration={900}
                    onClose={this.handleCloseSnackBar}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Successfully submitted timesheet</span>}
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