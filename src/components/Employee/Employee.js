import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// TODO: Move Actions based on each component
import * as ActionCreators from './employeeAction';
import * as LoginActionCreators from './../Login/loginAction'
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
    };
    handleEdit = (rowData) => {

        console.log("EDIT USER DATA", rowData)
        this.setState({ fields: rowData })
        this.setState({ open: true });
        this.setState({ isEditDialog: true })
    }
    // handleDelete = (rowData) => {
    //     this.props.actions.deleteEmployee(rowData.id)
    // }
    handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        // console.log("user login id ",this.state.fields)
        if (this.state.isEditDialog) {
            this.props.actions.addEmployee(this.state.fields, this.props.login.data.loginId)
        } else {
            let fields = this.state.fields;
            fields.id = null;
            this.setState({ fields })
            this.props.actions.addEmployee(this.state.fields, this.props.login.data.loginId)
        }
        this.setState({ open: false });
    }

    constructor(props) {

        super(props);
        this.counter = 0;
        this.state = {
            isEditDialog: false,
            fields: {
                "id":null,
                "loginId":"",
                "firstName":"", 
                "lastName":"",
                 "dob":"", 
                 "designation":"", 
                 "joiningDate":"",
                  "role":"", 
                  "supervisorId":"", 
                  "location":""
            },
            errors: {},
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


    render() {
        const { title, order, orderBy, selected, rowsPerPage, page, rows } = this.state;
        const { classes, login } = this.props;
  
        return (
            <React.Fragment>
                <Header>
                </Header>
                <div style={{ margin: "2%" }}>
                    <h1>Employees</h1>

                    <Grid item xs={10}>
                        <Button variant="fab" color="primary" aria-label="Add" style={{ float: "right" }} onClick={this.handleClickOpen} >
                            <AddIcon />
                        </Button>              
                    </Grid>
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
                            label="Employee Id"
                            type="text"
                            inputProps={{
                                maxLength: 6,
                            }}
                            fullWidth
                            disabled={this.state.isEditDialog}
                            onChange={this.handleChange.bind(this, "loginId")}
                            value={this.state.fields["loginId"]}
                        // error={this.state.errors.departmentNameError}
                        // helperText={this.state.errors.errorRequired}
                        />
                                <TextField
                                    required
                                    margin="dense"
                                    id="firstName"
                                    label="First name"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "firstName")}
                                    value={this.state.fields["firstName"]}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="lastName"
                                    label="Last name"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "lastName")}
                                    value={this.state.fields["lastName"]}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="dob"
                                    label="Birthday"
                                    type="date"
                                    fullWidth
                                    // defaultValue="2017-05-24"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                    maxLength: 10,
                                    }}
                                    onChange={this.handleChange.bind(this, "dob")}
                                    value={this.state.fields["dob"]}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="designation"
                                    label="Designation"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "designation")}
                                    value={this.state.fields["designation"]}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="joiningDate"
                                    label="Joining Data"
                                    type="date"
                                    fullWidth
                                    // defaultValue="2017-05-24"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={this.handleChange.bind(this, "joiningDate")}
                                    value={this.state.fields["joiningDate"]}
                                />


                                <FormControl fullWidth required>
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
                                </FormControl>
                                <FormControl fullWidth required>
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
                                </FormControl>
                                <TextField
                                    required
                                    margin="dense"
                                    id="location"
                                    label="Location"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "location")}
                                    value={this.state.fields["location"]}
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
                        isEmployesTable = "true"
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