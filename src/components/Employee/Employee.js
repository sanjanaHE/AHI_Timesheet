import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import trim from 'trim'

// TODO: Move Actions based on each component
import * as ActionCreators from './employeeAction';
import * as LoginActionCreators from './../Login/loginAction'
import moment from 'moment';
import Header from './../Header/Header';
import EnhancedTable from './../Table/Table'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import FormHelperText from '@material-ui/core/FormHelperText';


class Employee extends React.Component {
    componentDidMount() {
        this.props.actions.getEmployees();
        this.props.login_actions.getLoggedUser();
    }
    handleClickOpen = () => {
        this.setState({ open: true });
        var fields = { ... this.state.fields };
        fields.id = "";
        fields.loginId = "";
        fields.firstName = "";
        fields.lastName = "";
        fields.dob = "";
        fields.designation = "";
        fields.joiningDate = "";
        fields.role = "";
        fields.supervisorId = "";
        fields.location = "";
        this.setState({ fields });
        this.setState({ isEditDialog: false });
    };

    handleClose = () => {
        this.setState({ open: false });
        this.setState({ errors: {} });
        this.setState({ errorColor: {} });
    };
    handleEdit = (rowData) => {


        rowData['dob'] = moment(rowData.dob, 'DD-MM-YYYY').format('MM-DD-YYYY')
        rowData['joiningDate'] = moment(rowData.joiningDate, 'DD-MM-YYYY').format('MM-DD-YYYY')
        console.log("EDIT USER DATA", rowData)
        this.setState({ fields: rowData })
        // this.setState({ fields: rowData, dob: moment(rowData.dob).format('MM-DD-YYYY'),  })
        // this.setState({ fields: rowData })
        this.setState({ open: true });
        this.setState({ isEditDialog: true })
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

        this.props.employees.data.map(element => {
            if (element.loginId == fields["loginId"] && this.state.isEditDialog == false) {
                errorColor["loginId"] = true;
                formIsValid = false;
                errors["loginId"] = "This empId is already added";
            }
        })

        if (!trim(fields["loginId"]).match(/[0-9]{6}/g)) {
            errorColor["loginId"] = true;
            formIsValid = false;
            errors["loginId"] = "Please enter digits only";
        }

        if (!fields["firstName"]) {
            errorColor["firstName"] = true;
            formIsValid = false;
            errors["firstName"] = "This field is required";

        }
        else if (trim(fields["firstName"]) == '') {
            errorColor["firstName"] = true;
            formIsValid = false;
            errors["firstName"] = "Please enter valid firstName";
        }
        if (!fields["lastName"]) {
            errorColor["lastName"] = true;
            formIsValid = false;
            errors["lastName"] = "This field is required";

        }
        else if (trim(fields["lastName"]) == '') {
            errorColor["lastName"] = true;
            formIsValid = false;
            errors["lastName"] = "Please enter valid lastName";
        }
        if (!fields["dob"]) {
            errorColor["dob"] = true;
            formIsValid = false;
            errors["dob"] = "This field is required";

        }
        if (!fields["designation"]) {
            errorColor["designation"] = true;
            formIsValid = false;
            errors["designation"] = "This field is required";

        }
        else if (trim(fields["designation"]) == '') {
            errorColor["designation"] = true;
            formIsValid = false;
            errors["designation"] = "Please enter valid designation";
        }
        if (!fields["joiningDate"]) {
            errorColor["joiningDate"] = true;
            formIsValid = false;
            errors["joiningDate"] = "This field is required";

        }
        if (!fields["role"]) {
            errorColor["role"] = true;
            formIsValid = false;
            errors["role"] = "This field is required";

        }
        if (!fields["supervisorId"]) {
            errorColor["supervisorId"] = true;
            formIsValid = false;
            errors["supervisorId"] = "This field is required";

        }
        if (!fields["location"]) {
            errorColor["location"] = true;
            formIsValid = false;
            errors["location"] = "This field is required";

        }
        else if (trim(fields["location"]) == '') {
            errorColor["location"] = true;
            formIsValid = false;
            errors["location"] = "Please enter valid location";
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
                this.props.actions.addEmployee(this.state.fields, this.props.login.data.loginId)
                this.setState({ open: false });
            }

        } else {
            let fields = this.state.fields;
            fields.id = null;
            this.setState({ fields })
            //checking for validation 
            if (this.handleValidation()) {
                this.props.actions.addEmployee(this.state.fields, this.props.login.data.loginId)
                this.setState({ open: false });
            }

        }

    }

    constructor(props) {

        super(props);
        this.counter = 0;
        this.state = {
            isEditDialog: false,
            fields: {
                "id": null,
                "loginId": "",
                "firstName": "",
                "lastName": "",
                "dob": "",
                "designation": "",
                "joiningDate": "",
                "role": "",
                "supervisorId": "",
                "location": ""
            },
            errors: {},
            errorColor: {},
            open: false, //for dialog open
            order: 'asc',
            orderBy: 'id',
            selected: [],
            page: 0,
            rowsPerPage: 5,
            title: 'Employee',
            rows: [
                { id: 'ids', numeric: false, disablePadding: false, label: 'Index' },
                { id: 'loginId', numeric: false, disablePadding: false, label: 'Employee ID' },
                { id: 'firstName', numeric: false, disablePadding: false, label: 'First name' },
                { id: 'lastName', numeric: false, disablePadding: false, label: 'Last name' },
                { id: 'dob', numeric: false, disablePadding: false, label: 'Date of Birth' },
                { id: 'designation', numeric: false, disablePadding: false, label: 'Designation' },
                { id: 'joiningDate', numeric: false, disablePadding: false, label: 'Joining date' },
                { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
                { id: 'supervisorName', numeric: false, disablePadding: false, label: 'Supervisor' },
                { id: 'location', numeric: false, disablePadding: false, label: 'Location' },
                { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
            ]
        };

    }

    formatDateInGivenFormat = (date) => {
        let d = moment(date).format('YYYY-MM-DD');
        return d;
    }


    render() {
        const { title, order, orderBy, selected, rowsPerPage, page, rows } = this.state;
        const { classes, login } = this.props;
        return (
            <React.Fragment>
                <Header>
                </Header>
                <div style={{ margin: "2%" }}>
                    <h1>Employees</h1>
                    <Tooltip title="Add employee">
                        <Button variant="fab" color="primary" aria-label="Add" style={{ float: "right" }} onClick={this.handleClickOpen} >
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
                            Employee</DialogTitle>
                        <DialogContent>
                            <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                                <TextField
                                    required
                                    autoFocus
                                    margin="dense"
                                    id="loginId"
                                    name="loginId"
                                    label="Employee Id"
                                    type="text"
                                    inputProps={{
                                        maxLength: 6,
                                    }}
                                    fullWidth
                                    disabled={this.state.isEditDialog}
                                    onChange={this.handleChange.bind(this, "loginId")}
                                    value={this.state.fields["loginId"]}
                                    error={this.state.errorColor.loginId}
                                    helperText={this.state.errors.loginId}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="firstName"
                                    name="firstName"
                                    label="First name"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "firstName")}
                                    value={this.state.fields["firstName"]}
                                    error={this.state.errorColor.firstName}
                                    helperText={this.state.errors.firstName}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="lastName"
                                    name="lastName"
                                    label="Last name"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "lastName")}
                                    value={this.state.fields["lastName"]}
                                    error={this.state.errorColor.lastName}
                                    helperText={this.state.errors.lastName}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="dob"
                                    name="dob"
                                    label="Birthday"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        maxLength: 10,
                                    }}
                                    onChange={this.handleChange.bind(this, "dob")}
                                    defaultValue={this.formatDateInGivenFormat(this.state.fields["dob"])}
                                    error={this.state.errorColor.dob}
                                    helperText={this.state.errors.dob}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="designation"
                                    name="designation"
                                    label="Designation"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "designation")}
                                    value={this.state.fields["designation"]}
                                    error={this.state.errorColor.designation}
                                    helperText={this.state.errors.designation}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="joiningDate"
                                    name="joiningDate"
                                    label="Joining Data"
                                    type="date"
                                    fullWidth
                                    defaultValue={this.formatDateInGivenFormat(this.state.fields["joiningDate"])}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={this.handleChange.bind(this, "joiningDate")}
                                    error={this.state.errorColor.joiningDate}
                                    helperText={this.state.errors.joiningDate}
                                />
                                <FormControl fullWidth required error={this.state.errorColor.role}>
                                    <InputLabel htmlFor="role">Role</InputLabel>
                                    <Select
                                        inputProps={{
                                            name: 'role',
                                            id: 'role',
                                        }}
                                        onChange={this.handleChange.bind(this, "role")}
                                        value={this.state.fields["role"]}
                                    >
                                        <MenuItem value="" selected>
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="admin">Admin</MenuItem>
                                        <MenuItem value="manager">Manager</MenuItem>
                                        <MenuItem value="user">User</MenuItem>
                                    </Select>
                                    <FormHelperText>{this.state.errors.role}</FormHelperText>
                                </FormControl>
                                <FormControl fullWidth required error={this.state.errorColor.supervisorId}>
                                    <InputLabel htmlFor="supervisorId">Supervisor</InputLabel>
                                    <Select
                                        inputProps={{
                                            name: 'supervisorId',
                                            id: 'supervisorId',
                                        }}
                                        onChange={this.handleChange.bind(this, "supervisorId")}
                                        value={this.state.fields["supervisorId"]}
                                    >
                                        <MenuItem disabled value="select" selected>
                                            <em>Select</em>
                                        </MenuItem>
                                        {
                                            this.props.employees.data.map(element => {
                                                return <MenuItem value={element.id}>{element.firstName} {element.lastName}</MenuItem>
                                            })
                                        }
                                    </Select>
                                    <FormHelperText>{this.state.errors.supervisorId}</FormHelperText>
                                </FormControl>
                                <TextField
                                    required
                                    margin="dense"
                                    id="location"
                                    name="location"
                                    label="Location"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "location")}
                                    value={this.state.fields["location"]}
                                    error={this.state.errorColor.location}
                                    helperText={this.state.errors.location}
                                />
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

                    <EnhancedTable title="Employee"
                        order={order}
                        orderBy={orderBy}
                        selected={selected}
                        data={this.props.employees.data}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rows={rows}
                        onRowEdit={this.handleEdit}
                        isEmployesTable="true"
                    ></EnhancedTable>
                </div>
            </React.Fragment>
        );
    }

}
function mapStateToProps(state) {
    return {

        employees: state.employees,
        login: state.login
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(ActionCreators, dispatch),
        login_actions: bindActionCreators(LoginActionCreators, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Employee);