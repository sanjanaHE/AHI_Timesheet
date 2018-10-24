import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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

const resultDates = [];
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
});

class Timesheet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: "2018-10-14",
            endDate: "2018-10-20",
            timesheet: [{
                projectName: 18,
                taskName: 153,
                timesheetEnteries: {
                    "2018-10-14T18:30:00.000+0000": {
                        "id": 66,
                        "empId": 2,
                        "projectName": "asset management",
                        "taskName": "test2",
                        "date": "2018-10-14T18:30:00.000+0000",
                        "totalHours": 5
                    },
                    "2018-10-15T18:30:00.000+0000": {
                        "id": 67,
                        "empId": 2,
                        "projectName": "asset management",
                        "taskName": "test2",
                        "date": "2018-10-15T18:30:00.000+0000",
                        "totalHours": 2
                    },
                    "2018-10-16T18:30:00.000+0000": {
                        "id": 68,
                        "empId": 2,
                        "projectName": "asset management",
                        "taskName": "test2",
                        "date": "2018-10-16T18:30:00.000+0000",
                        "totalHours": 3
                    },
                    "2018-10-17T18:30:00.000+0000": {
                        "id": 69,
                        "empId": 2,
                        "projectName": "asset management",
                        "taskName": "test2",
                        "date": "2018-10-17T18:30:00.000+0000",
                        "totalHours": 4
                    },
                    "2018-10-18T18:30:00.000+0000": {
                        "id": 70,
                        "empId": 2,
                        "projectName": "asset management",
                        "taskName": "test2",
                        "date": "2018-10-18T18:30:00.000+0000",
                        "totalHours": 5
                    }
                }
            }
            ]
        }
        
        const start = moment("2018-10-16", 'YYYY-MM-DD');
        const end = moment("2018-10-22", 'YYYY-MM-DD');

        const current = start.clone();
        

        while (current.isBefore(end)) {
        resultDates.push(current.format("YYYY-MM-DD"));
        current.add(1, "day");
        }

        console.log(resultDates);
    }

    componentDidMount() {
        this.props.login_actions.getLoggedUser();
        this.props.project_actions.getProjects();
        // console.log(this.props)
        // if (this.props.login.data.length > 0) {
        // this.props.task_actions.getTasks(this.props.login.data.id);
        // this.props.actions.getTimesheetEntries(this.props.login.data.id, '14-10-2018', '20-10-2018');
        // }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.login.data.length == 0) {
            this.props.task_actions.getTasks(nextProps.login.data.id);
            this.props.actions.getTimesheetEntries(nextProps.login.data.id, '14-10-2018', '23-10-2018');
        }
        this.setState({timesheet: nextProps.timesheet.data})
    }

    renderProjects(activeProject) {
        return (
            <Grid item sm md xs>
                <InputLabel htmlFor="projectId">Projects</InputLabel>
                <Select
                    fullWidth
                    autoWidth={true}
                    // inputProps={{
                    //     name: 'projectId',
                    //     id: 'projectId',
                    // }}
                    input={
                        <OutlinedInput
                          labelWidth={this.state.labelWidth}
                          name="task"
                          id="taskName"
                        />
                      }
                    value={activeProject}
                >
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

    renderTasks(activeTask) {
        return (<Grid item sm md xs>
            {/* <FormControl fullWidth> */}
            <InputLabel htmlFor="taskId">Tasks</InputLabel>
            <Select
                label="Tasks"
                fullWidth
                // inputProps={{
                //     name: 'taskId',
                //     id: 'taskId',
                // }}
                input={
                    <OutlinedInput
                      labelWidth={this.state.labelWidth}
                      name="task"
                      id="taskName"
                    />
                  }
                value={activeTask}
            >
                <MenuItem disabled value="select" selected>
                    <em>Select</em>
                </MenuItem>
                {
                    this.props.tasks.data.map(element => {
                        return <MenuItem value={element.taskName}>{element.taskName}</MenuItem>
                    })
                }
            </Select>
            {/* </FormControl> */}
        </Grid>)
    }

    handleChangeHours = (e, timesheetEntry) => {
        let timesheet = Object.assign([], this.state.timesheet);
        for(let i =0; i<timesheet.length; i++){
            if(timesheet[i].projectName === timesheetEntry.projectName 
                && timesheet[i].taskName === timesheetEntry.taskName) {
                    timesheet[i].timesheetEnteries[timesheetEntry.date] = timesheetEntry
                    timesheet[i].timesheetEnteries[timesheetEntry.date]['totalHours'] = e.target.value
                }
        }
        this.setState({timesheet: timesheet})
    }
    renderTimesheetInput(timesheetEntry) {
        return (
            <Grid item sm xs md>
                <TextField
                    id="totalHours"
                    label={timesheetEntry?moment(timesheetEntry.date).format('DD-MM-YYYY'):null}
                    type="number"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                      }}
                    margin="normal"
                    variant="outlined"
                    onChange={ (e) => this.handleChangeHours(e,timesheetEntry)}
                    value={timesheetEntry?timesheetEntry.totalHours:null}
                />
            </Grid>)
    }

     dateCheck(project, task, timesheet){
        return resultDates.map(date => {
            var m = momentTZ.tz(date+'T00:00:00.000', 'Asia/Kolkata');
            let timesheetDate = m.utc().format('YYYY-MM-DDTHH:mm:ss.000+0000');
            if (timesheet.hasOwnProperty(timesheetDate)) {
                 return this.renderTimesheetInput(timesheet[timesheetDate])
            } else {
                return this.renderTimesheetInput({date: timesheetDate, projectName: project, 
                    taskName: task,empId: this.props.login.data.id })
            }
            })
     } 

    renderRow(project, task, timesheet) {
        // console.log(timesheet)
        return (<Grid container spacing={24}>
            {this.renderProjects(project)}
            {this.renderTasks(task)}
            {/* // Generate an array of dates from startDate to endDate
            // Iterate over the array of dates, If the value exists then render timesheet input
            // Else
            // Render empty timesheet input */}

            {this.dateCheck(project, task, timesheet)}
        </Grid>)
    }

    handleSubmitAction = () => {
        this.props.actions.saveTimesheetEntries(this.state.timesheet)
    }
    render() {
        const { classes } = this.props;
        // console.log(this.props.timesheet.data)
        return (
            <React.Fragment>
                <Header></Header>
                <div style={{ margin: "2%" }}>
                    <h1>Timesheet</h1>
                    {this.state.timesheet.length > 0 ?
                        this.state.timesheet.map((ele, index) => {
                            // console.log("timesheet entries",ele.timesheetEnteries)
                            return this.renderRow(ele.projectName, ele.taskName, ele.timesheetEnteries)
                        }) : null}
                    <Button onClick={this.handleSubmitAction}>Submit</Button>
                </div>
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