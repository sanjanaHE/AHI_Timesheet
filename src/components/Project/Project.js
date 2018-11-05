import React from 'react';
import trim from 'trim'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from './projectAction';
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


class Project extends React.Component {
    componentDidMount() {
        // Fetch Data for Department
        this.props.actions.getProjects();
        this.props.actions.getUsers();
    }
    handleClickOpen = () => {
        console.log("in handle click open")
        this.setState({ open: true });
        var fields = { ...this.state.fields };
        fields.projectName = "";
        fields.projectDescription = "";
        fields.headedByUserId = "";
        this.setState({ fields });
        this.setState({ isEditDialog: false })
        console.log(this.state)
    };

    handleValidation() {

        let fields = this.state.fields;
        let errors = {};    //error messages
        let errorColor = {}; //true/false
        let formIsValid = true;

        if (!fields["projectName"]) {
            errorColor["projectName"] = true;    //true for error(red color will appear)
            formIsValid = false;
            errors["projectName"] = "This field is required";

        }
        else if (trim(fields["projectName"]) == '') {
            errorColor["projectName"] = true;
            formIsValid = false;
            errors["projectName"] = "Please enter valid project name";
        }
        if (!fields["projectDescription"]) {
            errorColor["projectDescription"] = true;
            formIsValid = false;
            errors["projectDescription"] = "This field is required";

        }
        else if (trim(fields["projectDescription"]) == '') {
            errorColor["projectDescription"] = true;
            formIsValid = false;
            errors["projectDescription"] = "Please enter valid description";
        }
        if (!fields["headedByUserId"]) {
            errorColor["headedByUserId"] = true;
            formIsValid = false;
            errors["headedByUserId"] = "This field is required";

        }

        this.setState({ errors: errors });
        this.setState({ errorColor: errorColor });
        return formIsValid;
    }

    handleClose = () => {
        this.setState({ open: false });
        this.setState({ errors: {} });
        this.setState({ errorColor: {} });
    };


    handleEdit = (rowData) => {

        console.log("DATA", rowData)
        this.setState({ fields: rowData })
        this.setState({ open: true });
        this.setState({ isEditDialog: true })
    }
    handleDelete = (rowData) => {
        this.props.actions.deleteProject(rowData.projectId)
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

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ open: true });  //dialogue box will be open

        if (this.state.isEditDialog) {
            //checking for validation 
            if (this.handleValidation()) {
                this.props.actions.addProject(this.state.fields)     //edited form submission
                this.setState({ open: false });
            }

        } else {
            let fields = this.state.fields;
            fields.departmentId = null;
            this.setState({ fields })
            //checking for validation 
            if (this.handleValidation()) {
                this.props.actions.addProject(this.state.fields)    //added form submission
                this.setState({ open: false });
            }

        }
    }

    constructor(props) {
        super(props);
        this.counter = 0;
        this.state = {
            isEditDialog: false,
            fields: {},
            errors: {},
            errorColor: {},
            open: false, //for dialog open
            order: 'asc',
            orderBy: 'projectName',
            selected: [],
            data: [],
            page: 0,
            rowsPerPage: 5,
            title: 'Project',
            rows: [
                { id: 'index', numeric: false, disablePadding: false, label: 'Index' },
                { id: 'projectName', numeric: false, disablePadding: false, label: 'Project Name' },
                { id: 'projectDescription', numeric: false, disablePadding: false, label: 'Description' },
                { id: 'headedBy', numeric: false, disablePadding: false, label: 'Headed By' },
                { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }

            ]

        };
    }

    render() {
        const { data, title, order, orderBy, selected, rowsPerPage, page, rows } = this.state;
        const { employees } = this.props;
        return (
            <React.Fragment>
                {/* <Header>
                </Header> */}
                <div style={{ margin: "2%" }}>
                    <h1>Projects</h1>
                    <Tooltip title="Add project">
                        <Button variant="fab" color="secondary" aria-label="Add" style={{ float: "right" }} onClick={this.handleClickOpen} >
                            <AddIcon />
                        </Button>
                    </Tooltip>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">
                            {this.state.isEditDialog ? 'Edit ' : 'Add '}
                            Project</DialogTitle>
                        <DialogContent>

                            <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>

                                <TextField
                                    required
                                    autoFocus
                                    margin="dense"
                                    id="projectName"
                                    name="projectName"
                                    label="Project name"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "projectName")}
                                    value={this.state.fields["projectName"]}
                                    error={this.state.errorColor.projectName}
                                    helperText={this.state.errors.projectName}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="projectDescription"
                                    name="projectDescription"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "projectDescription")}
                                    value={this.state.fields["projectDescription"]}
                                    error={this.state.errorColor.projectDescription}
                                    helperText={this.state.errors.projectDescription}
                                />
                                <FormControl fullWidth required  error={this.state.errorColor.headedByUserId}>
                                    <InputLabel htmlFor="headedByUserId">Headed By</InputLabel>
                                    <Select
                                        inputProps={{
                                            name: 'headedByUserId',
                                            id: 'headedByUserId',
                                        }}
                                        onChange={this.handleChange.bind(this, "headedByUserId")}
                                        value={this.state.fields["headedByUserId"]}
                                    >
                                        <MenuItem disabled value="select" selected>
                                            <em>Select</em>
                                        </MenuItem>
                                        {employees.data.map(employee => {
                                            return <MenuItem key={employee.id} value={employee.id}>{employee.firstName} {employee.lastName}</MenuItem>
                                        })
                                        }
                                    </Select>
                                    <FormHelperText>{this.state.errors.headedByUserId}</FormHelperText>
                                </FormControl>
                            </form>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                        </Button>
                            <Button type="submit" onClick={this.handleSubmit} color="primary">
                                Submit
                        </Button>
                        </DialogActions>
                    </Dialog>
                    <EnhancedTable title="Project"
                        order={order}
                        orderBy={orderBy}
                        selected={selected}
                        data={this.props.projects.data}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rows={rows}
                        onRowEdit={this.handleEdit}
                        onRowDelete={this.handleDelete}
                    ></EnhancedTable>
                </div>
            </React.Fragment>
        );
    }

}

function mapStateToProps(state) {
    return {
        projects: state.projects,
        employees: state.employees
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...ActionCreators }, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Project);
