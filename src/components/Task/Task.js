import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from './taskAction';
import * as LoginActionCreators from './../Login/loginAction'
import Header from './../Header/Header';
import EnhancedTable from './../Table/Table'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import SnackbarMsg from './../SnackbarMsg/SnackbarMsg'

import trim from 'trim'


class Task extends React.Component {
    componentDidMount() {
        this.props.login_actions.getLoggedUser();
        if (this.props.login.data.length != 0)
        this.props.actions.getTasks(this.props.login.data.id);
            this.setState({data:this.props.tasks.data})
    }
    

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        if (this.props.login.data.length == 0)
            this.props.actions.getTasks(nextProps.login.data.id);
        this.setState({data:nextProps.tasks.data})
    }
    handleClickOpen = () => {
        this.setState({ open: true });
        var fields = { ... this.state.fields };
        fields.taskName = "";
        fields.taskDescription = "";
        this.setState({ fields });
        this.setState({ isEditDialog: false })
    };

    handleClose = () => {
        this.setState({ open: false });
        this.setState({ errors: {} });
        this.setState({ errorColor: {} });
    };


    handleEdit = (rowData) => {

        // console.log("DATA", rowData)
        var fields = Object.assign({}, rowData); //fix for edit changing grid on cancel

        this.setState({ fields: fields })
        this.setState({ open: true });
        this.setState({ isEditDialog: true })
    }
    handleDelete = (rowData) => {
        this.props.actions.deleteTask(rowData.taskId, this.props.login.data.id)
    }

    handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });

            //setting errors and errorcolor in state
            let errorColor = this.state.errorColor;
            let errors = this.state.errors;
    
            if (fields[field] == '') {
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

    handleValidation() {

        let fields = this.state.fields;
        let errors = {};    //error messages
        let errorColor = {}; //true/false
        let formIsValid = true;

        if (!fields["taskName"]) {
            errorColor["taskName"] = true;    //true for error(red color will appear)
            formIsValid = false;
            errors["taskName"] = "This field is required";

        }
        else if (trim(fields["taskName"]) == '') {
            errorColor["taskName"] = true;
            formIsValid = false;
            errors["taskName"] = "Please enter valid task name";
        }
        if (!fields["taskDescription"]) {
            errorColor["taskDescription"] = true;
            formIsValid = false;
            errors["taskDescription"] = "This field is required";

        }
        else if (trim(fields["taskDescription"]) == '') {
            errorColor["taskDescription"] = true;
            formIsValid = false;
            errors["taskDescription"] = "Please enter valid description";
        }

        this.setState({ errors: errors });
        this.setState({ errorColor: errorColor });
        return formIsValid;
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({ open: true });  //dialogue box will be open
        if (this.state.isEditDialog) {
            //checking for validation
            if (this.handleValidation()) {
                this.props.actions.addTask(this.state.fields, this.props.login.data.id)     //edited form submission
                this.setState({ open: false });
            }
            
        } else {
            let fields = this.state.fields;
            fields.taskId = null;
            this.setState({ fields })
            //checking for validation
            if (this.handleValidation()) {
                this.props.actions.addTask(this.state.fields, this.props.login.data.id)    //added form submission
                this.setState({ open: false });
            }
           
        }
    }

    constructor(props) {
        super(props);
        this.counter = 0;
        this.state = {
            data:[],
            isEditDialog: false,
            fields: {},
            errors: {},
            errorColor: {},
            open: false, //for dialog open
            order: 'asc',
            orderBy: 'taskName',
            selected: [],
            data: [],
            page: 0,
            rowsPerPage: 5,
            title: 'Task',
            rows: [
                { id: 'index', numeric: false, disablePadding: false, label: 'Index' },
                { id: 'taskName', numeric: false, disablePadding: false, label: 'Task Name' },
                { id: 'taskDescription', numeric: false, disablePadding: false, label: 'Description' },
                { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }

            ]

        };
    }

    render() {
        const { data, title, order, orderBy, selected, rowsPerPage, page, rows } = this.state;
        const { tasks, login } = this.props;
        // console.log(this.props.login.data.id)
        return (
            <React.Fragment>
                <SnackbarMsg/>
                <div style={{ margin: "2%" }}>
                    <h1>Tasks</h1>
                    <Tooltip title="Add task">
                        <Button variant="fab" color="secondary" aria-label="Add" style={{ float: "right" }} onClick={this.handleClickOpen} >
                            <AddIcon />
                        </Button>
                    </Tooltip>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">
                            {this.state.isEditDialog ? 'Edit ' : 'Add '}
                            Task</DialogTitle>
                        <DialogContent>

                            <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>

                                <TextField
                                    required
                                    autoFocus
                                    margin="dense"
                                    id="taskName"
                                    name="taskName"
                                    label="Task name"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "taskName")}
                                    value={this.state.fields["taskName"]}
                                    error={this.state.errorColor.taskName}
                                    helperText={this.state.errors.taskName}
                                />
                                {/* <FormHelperText error = {this.state.errors.TaskNameError}>This field is required</FormHelperText> */}
                                <TextField
                                    required
                                    margin="dense"
                                    id="taskDescription"
                                    name="taskDescription"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "taskDescription")}
                                    value={this.state.fields["taskDescription"]}
                                    error={this.state.errorColor.taskDescription}
                                    helperText={this.state.errors.taskDescription}
                                />

                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button  onClick={this.handleClose} color="primary">
                                Cancel
                        </Button>
                            <Button  type="submit" onClick={this.handleSubmit} color="primary">
                                Submit
                        </Button>
                        </DialogActions>
                    </Dialog>
                    <EnhancedTable title="Task"
                        order={order}
                        orderBy={orderBy}
                        selected={selected}
                        data={data}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rows={rows}
                        onRowEdit={this.handleEdit}
                        onRowDelete={this.handleDelete}
                        isDeleteButtonRequired="false"
                    ></EnhancedTable>
                </div>
            </React.Fragment>
        );
    }

}

function mapStateToProps(state) {
    return {
        tasks: state.tasks,
        login: state.login,
        snackbarMsg : state.snackbarMsg
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...ActionCreators }, dispatch),
        login_actions: bindActionCreators(LoginActionCreators, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Task);
