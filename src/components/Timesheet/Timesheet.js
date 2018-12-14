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
import SnackbarMsg from './../SnackbarMsg/SnackbarMsg'

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
        backgroundColor: theme.palette.secondary.main
    },
    timesheetHeader: {
        marginBottom: "2%",
        background: "#BDBDBD", fontWeight: "bold"
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
    timesheetWrapper:{
        margin: "4%", 
        padding:"2%",
        background: "whitesmoke",
        boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2) "
        // 0px 2px 2px 0px rgba(0, 0, 0, 0.14) 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    },
    input: {
        paddingTop: "0.2em",
        paddingBottom: "0.5em",
    },
    rowsWrapper:{
       height:"40vh",
       overflowY:"auto",
       overflowX:"hidden",
    
        [theme.breakpoints.up('xl')]: {
            height:"70vh",
        },
        [theme.breakpoints.up('lg') && theme.breakpoints.down('xl')]: {
            height:"60vh",
        },
        [theme.breakpoints.between('md','lg')]:{
            height:"50vh",
        },
        [theme.breakpoints.up('md')]: {
            height:"30vh",
        },
        [theme.breakpoints.up('sm') && theme.breakpoints.down('md')]: {
            height:"45vh",
        },
        [theme.breakpoints.up('xs') && theme.breakpoints.down('sm')]: {
            height:"40vh",
        },
        [ theme.breakpoints.down('sm')]: {
            height:"30vh",
        }
      },
});

class Timesheet extends Component {
    constructor(props) {
        super(props)
        const today = moment().startOf('isoWeek');
        this.state = {
            tasks: [],
            errors: {},
            errorColor: {},
            gotDates: false,
            startDate: today,
            endDate: today,
            timesheet: [],
            selectedDatesRange: [],
            submitSuccessSnackBar: false
        }
    }

    
    //-----------------------------lifecycle methods-----------------------------------------------------
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
    //-----------------------------------------------------------------------------------------------------

    //-----------------------------------------render methods---------------------------------------------
    renderDeleteRow(rowId) {
        // console.log(rowId)
        return (
            <Grid item sm={1} xs={1} md={1} >
                <IconButton aria-label="Delete" onClick={() => this.handleDeleteRow(rowId)}>
                    <DeleteIcon style={{ "color": "red" }} fontSize="small" />
                </IconButton>
             </Grid>
        )
    }
    renderTimesheetInput(timesheetEntry) {
        // console.log("in render timesheet input ",timesheetEntry.totalHours)
        if (timesheetEntry.totalHours == null) timesheetEntry.totalHours = 0;
        else if (timesheetEntry.totalHours < 0 || timesheetEntry.totalHours > 9) timesheetEntry.totalHours = 0;
        return (
            <React.Fragment>
                <Grid item sm={1} xs={1} md={1}>
                    <TextField
                        id="totalHours"
                        type="number"
                        fullWidth
                        variant="outlined"
                        inputProps={{ maxLength: 4, min: 0, max: 9,step :"0.01", minlength: 1 }}
                        // onInput={(e)=>{ 
                        //     e.target.value = Math.max(0, parseFloat(e.target.value) ).toString().slice(0,2)
                        // }}
                        onChange={(e) => this.handleChangeHours(e, timesheetEntry)}
                        value={timesheetEntry ? timesheetEntry.totalHours : 0}
                        InputProps={{classes:{
                            input: this.props.classes.input
                        } }}
                    />
                </Grid>
            </React.Fragment>)
    }
    renderProjects(rowId, activeProject) {
        return (
            <Grid item sm={1} md={1} xs={1}>
                <FormControl fullWidth style={{ height: "100%" }} required error={this.state.errors.hasOwnProperty(`${rowId}`) && this.state.errors[rowId].hasOwnProperty('projectId')}>

                    <Select
                        // style={{ marginTop: "20%", height: "40%" }}
                        style={{  height: "40%" }}
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
        return (<Grid item sm={1} md={1} xs={1}>
            <FormControl fullWidth style={{ height: "100%" }} required error={this.state.errors.hasOwnProperty(`${rowId}`) && this.state.errors[rowId].hasOwnProperty('taskId')}>

                <Select
                    // style={{ marginTop: "20%", height: "40%" }}
                    style={{  height: "40%" }}
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
    renderTicketId(rowId,taskDesc){
        return (
            <React.Fragment>
                <Grid item sm={2} xs={2} md={2}>
                    <TextField
                        required
                        id="taskDesc"
                        name="taskDesc"
                        type="text"
                        fullWidth
                        onChange={(e) => this.handleChangeTaskAndProjectName(e, rowId)}
                        value={taskDesc}
                        variant="outlined"
                        error={this.state.errors.hasOwnProperty(`${rowId}`) && this.state.errors[rowId].hasOwnProperty('taskDesc')}
                        helperText={this.state.errors.hasOwnProperty(`${rowId}`) && this.state.errors[rowId].hasOwnProperty('taskDesc') ?
                        this.state.errors[rowId].taskDesc :
                        null}
                        InputProps={{classes:{
                            input: this.props.classes.input
                        } }}
                    />
                </Grid>
            </React.Fragment>)
    }
    //--------------function to render each row ------------------------------------------------------------------
    renderRow(isRowDeletable, rowId, project,taskDesc, task, timesheet) {
        // console.log("timesheet in render row",rowId, project, task ,timesheet)
        return (<Grid container spacing={16} style={{ margin: "0 0 -3% 0"}}>
            {this.renderProjects(rowId, project)}
            {this.renderTasks(rowId, task)}
            {this.renderTicketId(rowId,taskDesc)}

            {/* // Generate an array of dates from startDate to endDate
            // Iterate over the array of dates, If the value exists then render timesheet input
            // Else
            // Render empty timesheet input */}

            {this.dateCheck(rowId, project, task, timesheet)}

            {isRowDeletable ? this.renderDeleteRow(rowId) : null}

            {/* for duplicate entry alert */}
            <Dialog
                open={this.state.submitAlertSnackBar}
                onClose={this.handleCloseDupAlertSnackBar}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                {/* <DialogTitle id="alert-dialog-title">Warning!</DialogTitle> */}
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You are trying to enter duplicate entry!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCloseDupAlertSnackBar} color="primary" autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>)
    }
    //-----------------------------------------------------------------------------------------------------------

    //-------------------------------handle methods---------------------------------------------------------------
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
                timesheet[i].timesheetEnteries[timesheetEntry.date]['totalHours'] = parseFloat(e.target.value)
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
        //console.log("rowid",rowId)
        // console.log("in change taskName,projectname ", e.target.value, rowId);
        // console.log("state --- ", this.state.timesheet);
        let timesheet = Object.assign([], this.state.timesheet);
        let taskId, projectId, taskDesc;
        //-------validation for duplicate task name and project name pairs---------
        for (let i = 0; i < timesheet.length; i++) {
            if (timesheet[i].rowId == rowId) {
                if (e.target.name == 'taskId') {
                    taskId = e.target.value;
                    projectId = timesheet[i].projectId;
                    taskDesc = timesheet[i].taskDesc;
                } else if(e.target.name == 'projectId') {
                    taskId = timesheet[i].taskId;
                    projectId = e.target.value;
                    taskDesc = timesheet[i].taskDesc;
                }else{
                    taskDesc = e.target.value;
                    taskId = timesheet[i].taskId;
                    projectId = timesheet[i].projectId;
                }
            }
        }
        for (let i = 0; i < timesheet.length; i++) {
            //check if duplicate entry exists
            if (timesheet[i].rowId != rowId &&
                timesheet[i].projectId == projectId
                && timesheet[i].taskId == taskId && timesheet[i].taskDesc == taskDesc ) {
                // console.log('RAISE ERROR')
                this.setState({ submitAlertSnackBar: true })

                return;
            }
        }
        //---------------end of validation-----------------------------------------------------
        
        for (let i = 0; i < timesheet.length; i++) {
            // console.log(timesheet[i].rowId , "__",timesheet[i].projectName,"___",timesheet[i].taskName,"___",timesheet[i].taskID)
           
            //----------searching for rowid in the list
            if (timesheet[i].rowId == rowId) { 
                // console.log("ee",timesheet[i].rowId , rowId)

                //------to fill project name and task name of corresponding row
                // console.log(e.target.name,e.target.value)
                timesheet[i][e.target.name] = e.target.value;
            }

            //-----------to fill totalHours fields
            //------------- since timesheet[i].timesheetEntries is in format {{},{},{}} ==> get keys('dates') and its values
                for (var key in timesheet[i].timesheetEnteries) {
                    // console.log("key",key, rowId)
                    if (timesheet[i].timesheetEnteries.hasOwnProperty(key)) {
                        // console.log(timesheet[i].rowId )
                        if (timesheet[i].rowId == rowId) {
                            // console.log("timesheet[i].rowId == rowId")
                           // console.log("row id matches-----------------")
                            timesheet[i].timesheetEnteries[key][e.target.name] = e.target.value
                        }
                    }
                }
        }
        this.setState({ timesheet: timesheet })
        this.handleValidation()
        console.log(timesheet)

    }
    
    renderSumHours(){
        let timesheet = Object.assign([], this.state.timesheet);
        let sumOfRow=0,sumOfCol=0,sumOfRowArray =[],sumOfColArray = [];
        // let sum1 = 0 , sum2 = 0, sum3 = 0, sum4 = 0,sum5 = 0, sum6 = 0, sum7 = 0;
        let eachRow=[],allRowsData=[]
        for (let i = 0; i < timesheet.length; i++) {
            eachRow = Object.values(timesheet[i].timesheetEnteries)
            allRowsData.push(eachRow)
        }
        let result = {};

        allRowsData.forEach((i) => {
            i.forEach((j)=>{
            //    console.log(j)
                result[j.date] = result[j.date] || { date: j.date, totalHours: 0 };
                if(!Number.isNaN(j.totalHours)){
                    result[j.date].totalHours += j.totalHours;
                }
                
            })
        });

        // result = Object.values(result)
        // console.log(result);
        // console.log(this.state.selectedDatesRange)
        // result.forEach(hr =>{
        //     sumOfColArray.push(hr.totalHours)
        // })
        // this.state.selectedDatesRange.forEach(date=>{
        //     sumOfColArray.push()
        // })
       // console.log(sumOfColArray)

      
        //=========================================sum of rows====================================================================
            for (let i = 0; i < timesheet.length; i++) {
                for (var key in timesheet[i].timesheetEnteries) {
                    // console.log("key--",key)
                    if(timesheet[i].timesheetEnteries.hasOwnProperty(key)){
                        sumOfRow = sumOfRow + timesheet[i].timesheetEnteries[key]['totalHours']
                    }
                }
                sumOfRowArray.push(sumOfRow)
                // console.log(sumOfRowArray)
                sumOfRow = 0
            }
        //======================================end of sum of rows==================================================================
        // console.log('RESULT', result)
        return(
            <Grid container spacing={0} className={this.props.classes.timesheetHeader}>
                <Grid item sm={4} md={4} xs={4}>
                    Total hours(Hrs)
                </Grid>
                {
                        this.state.selectedDatesRange.map(date=>{
                            return (
                                <Grid item sm={1} md={1} xs={1}>{result.hasOwnProperty(date) && !Number.isNaN(result[date].totalHours) ? result[date].totalHours: 0}</Grid>
                            );
                    })
                }
                
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
    updateDateRangeBasedOnSelectedDate = (selectedDate) => {
        // let dayOfWeek = selectedDate.day();
        // console.log('SELECTED DATE', selectedDate, dayOfWeek)
        // selectedDate.subtract(6, "days")    
        // const endDate = startDate.add("days", 7)    // set to the first day of this week, 12:00 am
        // console.log('date', selectedDate)
        // console.log('start date', startDate)
        // console.log('end date', endDate)
        let startDate = selectedDate.clone()
        let dateRange = [], n = 6
        dateRange.push(selectedDate.format("YYYY-MM-DD"))
        while (n > 0) {
            selectedDate.add(1, "day")
            dateRange.push(selectedDate.format("YYYY-MM-DD"))
            n--;
        }
        // dateRange = dateRange.reverse();
        this.props.actions.getTimesheetEntries(this.props.login.data.id,
            startDate.format('DD-MM-YYYY'),
            selectedDate.format('DD-MM-YYYY'));
        // console.log(startDate, selectedDate, dateRange)
        this.setState({ endDate: selectedDate, selectedDatesRange: dateRange, startDate: startDate })
    }
    
    handleValidation() {
        // console.log(this.state.timesheet)
        let errors = {};    //error messages
        let errorColor = {}; //true/false
        let formIsValid = true;
        let rowErrors = {};
        this.state.timesheet.forEach(element => {
            let errorsPerRow = {}
            if (element.projectId == "null" || element.projectId == null) {
                formIsValid = false;
                errorsPerRow.projectId = "This field is required"
            }
            if (element.taskId == "null" || element.taskId == null) {
                formIsValid = false;
                errorsPerRow.taskId = "This field is required"
            }
            if (element.taskDesc == "null" || element.taskDesc == null) {
                formIsValid = false;
                errorsPerRow.taskDesc = "This field is required"
            }
            errors[element.rowId] = errorsPerRow
        })
        this.setState({ errors: errors });
        this.setState({ errorColor: errorColor });
        return formIsValid;
    }
    handleSubmitAction = () => {
        //console.log("before timesheet submit--- ", this.state.timesheet)
        if (this.handleValidation()) {
            this.props.actions.saveTimesheetEntries(this.state.timesheet)
            this.setState({ submitSuccessSnackBar: true })

            let timesheet = Object.assign([], this.state.timesheet);
            timesheet.forEach(element => {
                element.isRowDeletable = false;
            })
            this.setState({ timesheet: timesheet })
            // console.log(this.state.timesheet)
        }
    }

    handleCloseSnackBar = () => {

        this.setState({ submitSuccessSnackBar: false })
    }
    handleCloseDupAlertSnackBar = () => {
        this.setState({ submitAlertSnackBar: false })
    }
    handleMovePrevWeek = () => {
        let endDate = this.state.startDate.subtract(7, "days")
        this.updateDateRangeBasedOnSelectedDate(endDate)
    }
    handleMoveNextWeek = () => {
        let startDate = this.state.startDate.add(7, "day")
        this.updateDateRangeBasedOnSelectedDate(startDate)
    }
    handleAddRowAction = () => {
        this.setState({ timesheet: [...this.state.timesheet, { isRowDeletable: true, rowId: uuid.v4(), projectId: null,taskDesc : null, taskId: null, timesheetEnteries: {} }] })
    }
    //--------------------------------------------------------------------------------------------------------

    //------------------------------------------main render method-----------------------------------------------
    render() {
        const { classes } = this.props;
        // console.log(this.props)
        return (
            <React.Fragment>
                {/* <Header></Header> */}
                <h1>Timesheet</h1>
                <div className={classes.timesheetWrapper}>
                    
                    <Grid container spacing={0} style={{ "margin-bottom": "2%"}}
                     direction="row"
                     alignItems="center"
                     alignContent="space-around"
                     justify="space-around">
                        
                        <Grid item md={2} sm={2} xs={2}>
                        </Grid>
                        <Grid item md={2} sm xs>
                            <Button variant="contained" 
                                disabled={this.state.startDate.diff(moment(), 'day') <= -21 ? true : false}
                                color="primary" onClick={this.handleMovePrevWeek}>
                                {/* <FontAwesomeIcon icon="arrow-left" />  */}
                                {/* <Icon className="fa fa-plus-circle"/> */}
                                Previous week</Button>
                        </Grid>
                        <Grid item md={3} sm xs>
                            <Button variant="outlined" color="primary" style={{"pointerEvents":"none"}}>
                            <Typography variant="h3"> {this.state.startDate != undefined ? this.state.startDate.format('DD MMM YYYY') : null} -
                                {this.state.endDate.format('DD MMM YYYY')}
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item md={2} sm xs>
                            <Button variant="contained" color="primary"
                                disabled={this.state.endDate.diff(moment(), 'day') >= 0 ? true : false}
                                onClick={this.handleMoveNextWeek}> Next week </Button>
                        </Grid>
                        <Grid item md={2} sm xs>
                            {/* <Button variant="contained" color="secondary" onClick={this.handleAddRowAction}> <AddIcon /> Add Row</Button> */}
                            <Tooltip title="Add row">
                                <Button variant="fab"  style={{float:"right"}} color="secondary" aria-label="Add" onClick={this.handleAddRowAction} >
                                    <AddIcon />
                                </Button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} className={classes.timesheetHeader}>
                        <Grid item sm={1} md={1} xs={1} style={{lineHeight:"200%"}}>
                            <Typography variant="h3">Projects</Typography>
                        </Grid>
                        
                        <Grid item sm={1} md={1} xs={1} style={{lineHeight:"200%"}}>
                            <Typography variant="h3">Tasks</Typography>
                        </Grid>
                        <Grid item sm={2} md={2} xs={2} style={{lineHeight:"200%"}}>
                            <Typography variant="h3">Task description</Typography>
                        </Grid>
                        
                        {this.state.selectedDatesRange.map(date => {
                                return (
                                    <React.Fragment>
                                        <Grid item sm={1} xs={1} md={1}>
                                            <Typography variant="h3">{moment(date).format('DD MMM')}</Typography>
                                            <Typography variant="h3">{moment(date).format('ddd')}</Typography>
                                        </Grid>
                                    </React.Fragment>
                                )
                            })}
                        <Grid item sm={1} md={1} xs={1} style={{lineHeight:"200%"}}>
                            <Typography variant="h3">Action</Typography>
                        </Grid>
                    </Grid>
                    <div className = {classes.rowsWrapper}>
                        {this.state.timesheet.length > 0 ?
                            this.state.timesheet.map((ele, index) => { //coming from api response
                                // console.log("timesheet entries",ele)
                                return this.renderRow(ele.isRowDeletable, ele.rowId, ele.projectId,ele.taskDesc, ele.taskId, ele.timesheetEnteries)
                            }) : null}
                    </div>
                    {/* {this.state.timesheet} */}
                    {this.renderSumHours()}
                    <Button variant="contained" color="primary"
                        onClick={this.handleSubmitAction}
                        >Submit</Button>
                </div>
                {/* <SnackbarMsg/> */}
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
//----------------------------------------redux functions--------------------------------------------------------
function mapStateToProps(state) {
    return {
        timesheet: state.timesheet,
        tasks: state.tasks,
        projects: state.projects,
        login: state.login,
        // snackbarMsg : state.snackbarMsg
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