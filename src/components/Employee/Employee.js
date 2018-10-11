import React from 'react';
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

class Employee extends React.Component {
    createData(employeeId, firstName, lastName, dob, designation, joiningDate, role, supervisor, location) {

        this.counter += 1;
        return { id: this.counter, employeeId, firstName, lastName, dob, designation, joiningDate, role, supervisor, location };
    }
    handleClickOpen = () => {
        this.setState({ open: true });
        var fields = { ... this.state.fields };
        fields.departmentName = "";
        fields.description = "";
        fields.headedBy = "";
        this.setState({ fields });
        this.setState({isEditDialog : false});
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    handleEdit = (rowData) => {

        console.log("DATA", rowData)
        this.setState({ fields: rowData })
        this.setState({ open: true });
        this.setState({ isEditDialog: true })
    }
    handleDelete = (rowData) => {
        let notDeletedArr = [];
        this.state.data.map(eachData => {
            if (rowData.id != eachData.id) {
                notDeletedArr.push(eachData);
            }
            this.setState({ data: notDeletedArr })
        })
    }
    handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
    }
    handleSubmit = (event) => {
        //Make a network call somewhere
        event.preventDefault();
        if (this.state.isEditDialog) {
            let editArr = [];
            this.state.data.map(eachData => {
                if (eachData.id == this.state.fields.id) {
                    editArr.push(this.state.fields);
                }
                else {
                    editArr.push(eachData);
                }
            })
            this.setState({ data: editArr });
            this.setState({ open: false });
        } else {
            // console.log("department added with state ",this.state);

            console.log(this.state.fields)
            this.setState({
                data: [...this.state.data, this.createData(this.state.fields.employeeId,
                    this.state.fields.firstName, this.state.fields.lastName,
                    this.state.fields.dob,
                    this.state.fields.designation,
                    this.state.fields.joiningDate,
                    this.state.fields.role,
                    this.state.fields.supervisor,
                    this.state.fields.location)]
            })
            this.setState({ open: false });
        }
    }
    constructor(props) {
        super(props);
        this.counter = 0;
        this.state = {
            isEditDialog: false,
            fields: {},
            errors: {
            },
            open: false, //for dialog open
            order: 'asc',
            orderBy: 'firstName',
            selected: [],
            data: [
                this.createData('100011', 'A', 'last', 'qwe', 'designation', 'joiningDate', 'role', 'supervisor', 'Bngalore'),
                this.createData('100021', 'B', 'last', 'qwe', 'designation', 'joiningDate', 'role', 'supervisor', 'Bngalore'),
                this.createData('100031', 'C', 'last', 'qwe', 'designation', 'joiningDate', 'role', 'supervisor', 'Bngalore'),
                this.createData('100041', 'D', 'last', 'qwe', 'designation', 'joiningDate', 'role', 'supervisor', 'Bngalore'),
                this.createData('100051', 'E', 'last', 'qwe', 'designation', 'joiningDate', 'role', 'supervisor', 'Bngalore'),

            ],
            page: 0,
            rowsPerPage: 5,
            title: 'Employee',
            rows: [
                { id: 'ID', numeric: false, disablePadding: false, label: 'ID' },
                { id: 'employeeId', numeric: false, disablePadding: false, label: 'Employee Id' },
                { id: 'firstName', numeric: false, disablePadding: false, label: 'First name' },
                { id: 'lastName', numeric: false, disablePadding: false, label: 'Last name' },
                { id: 'dob', numeric: false, disablePadding: false, label: 'Date of Birth' },
                { id: 'designation', numeric: false, disablePadding: false, label: 'Designation' },
                { id: 'joiningDate', numeric: false, disablePadding: false, label: 'Joining date' },
                { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
                { id: 'supervisor', numeric: false, disablePadding: false, label: 'Supervisor' },
                { id: 'location', numeric: false, disablePadding: false, label: 'Location' },
                { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
            ]
        };
        console.log(this.state)
    }
    render() {
        const { data, title, order, orderBy, selected, rowsPerPage, page, rows } = this.state;
        const { classes } = this.props;
        return (
            <div style={{ margin: "2%" }}>
                <h1>Employees</h1>
                <Button variant="fab" color="primary" aria-label="Add" style={{ float: "right" }} onClick={this.handleClickOpen} >
                    <AddIcon />
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">
                { this.state.isEditDialog ? 'Edit ' : 'Add '}
                 Employee</DialogTitle>
                    <DialogContent>
                        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>

                            <TextField
                                required
                                autoFocus
                                margin="dense"
                                id="employeeId"
                                label="Employee Id"
                                type="text"
                                fullWidth
                                onChange={this.handleChange.bind(this, "employeeId")}
                                value={this.state.fields["employeeId"]}
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
                                id="birthday"
                                label="Birthday"
                                type="date"
                                fullWidth
                                defaultValue="2017-05-24"
                                onChange={this.handleChange.bind(this, "birthday")}
                                value={this.state.fields["birthday"]}
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
                                defaultValue="2017-05-24"
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
                                <InputLabel htmlFor="supervisor">Supervisor</InputLabel>
                                <Select
                                    inputProps={{
                                        name: 'supervisor',
                                        id: 'supervisor',
                                    }}
                                    onChange={this.handleChange.bind(this, "supervisor")}
                                    value={this.state.fields["supervisor"]}
                                >
                                    <MenuItem value="" selected>
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="100011">100011</MenuItem>
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
                    data={data}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rows={rows}
                    onRowEdit={this.handleEdit}
                    ></EnhancedTable>
            </div>
        );
    }
}

export default Employee;