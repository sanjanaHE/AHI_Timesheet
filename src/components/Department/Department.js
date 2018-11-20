import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import trim from 'trim'

// TODO: Move Actions based on each component
import * as DepartmentActionCreators from './departmentAction'
import Header from './../Header/Header';
import EnhancedTable from './../Table/Table'
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import FormHelperText from '@material-ui/core/FormHelperText';

class Department extends React.Component {
    componentDidMount() {
        // Fetch Data for Department
        this.props.actions.getDepartments();
        this.props.actions.getUsers();
        this.setState({ data: this.props.departments.data })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.departments.data })
    }
    handleClickOpen = () => {
        this.setState({ open: true });
        var fields = { ...this.state.fields };
        fields.departmentName = "";
        fields.description = "";
        fields.headedByUserId = "";
        this.setState({ fields });
        this.setState({ isEditDialog: false })
    };

    handleClose = () => {
        this.setState({ open: false });
        this.setState({ errors: {} });
        this.setState({ errorColor: {} });
        this.setState({ data: this.props.departments.data })
    };
    handleEdit = (rowData) => {
        console.log("EDIT DEPT DATA", rowData)
        var fields = Object.assign({}, rowData); 
        // this.props.actions.addDepartment(rowData.departmentId)
        this.setState({ fields: fields })
        this.setState({ open: true });
        this.setState({ isEditDialog: true })
    }
    handleDelete = (rowData) => {
        console.log("row data id ", rowData);
        this.setState({rowData: rowData})
        this.setState({openDeleteDialog:true})
    }
    handleDeleteDialog =()=>{
        this.props.actions.deleteDepartment(this.state.rowData.departmentId);
        this.setState({openDeleteDialog:false})

    }
    handleDeleteClose = () =>{
        this.setState({ openDeleteDialog: false });
    }
    handleValidation() {

        let fields = this.state.fields;
        let errors = {};    //error messages
        let errorColor = {}; //true/false
        let formIsValid = true;

        if (!fields["departmentName"]) {
            errorColor["departmentName"] = true;    //true for error(red color will appear)
            formIsValid = false;
            errors["departmentName"] = "This field is required";

        }
        else if (trim(fields["departmentName"]) == '') {
            errorColor["departmentName"] = true;
            formIsValid = false;
            errors["departmentName"] = "Please enter valid department name";
        }
        if (!fields["description"]) {
            errorColor["description"] = true;
            formIsValid = false;
            errors["description"] = "This field is required";

        }
        else if (trim(fields["description"]) == '') {
            errorColor["description"] = true;
            formIsValid = false;
            errors["description"] = "Please enter valid description";
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
        //Make a network call somewhere
        event.preventDefault();
        this.setState({ open: true });
        if (this.state.isEditDialog) {

            console.log("Fields in EDIT mode ", this.state.fields);

            //checking for validation 
            if (this.handleValidation()) {
                this.props.actions.addDepartment(this.state.fields);     //edited form submission
                this.setState({ open: false });
            }


        } else {
            this.state.errors.departmentNameError = false;

            console.log(this.state.fields);

            let fields = this.state.fields;
            fields.departmentId = null;
            this.setState({ fields })

            //checking for validation 
            if (this.handleValidation()) {
                this.props.actions.addDepartment(this.state.fields);    //added form submission
                this.setState({ open: false });
            }

            // this.props.actions.getDepartments();
        }


        // }
    }
    constructor(props) {
        super(props);
        this.counter = 0;
        this.state = {
            data: [],
            errorColor: {},
            isEditDialog: false,
            fields: {},
            errors: {},
            open: false, //for dialog open
            openDeleteDialog : false , // for delete dialog
            order: 'asc',
            orderBy: 'departmentId',
            selected: [],
            page: 0,
            rowsPerPage: 5,
            title: 'Department',
            rows: [
                { id: 'ID', numeric: false, disablePadding: false, label: 'ID' },
                { id: 'departmentName', numeric: false, disablePadding: false, label: 'Department Name' },
                { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
                { id: 'headedBy', numeric: false, disablePadding: false, label: 'Headed By' },
                { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
            ]

        };
        // console.log(this.state.rows);
    }

    render() {
        const { title, order, orderBy, selected, rowsPerPage, page, rows } = this.state;
        const { employees } = this.props;
        // console.log("employees ",JSON.stringify(employees))
        return (
            <React.Fragment>
                {/* <Header>
                </Header> */}

                <div style={{ margin: "2%" }}>
                    <h1>Departments</h1>
                    <Tooltip title="Add department">
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
                            Department</DialogTitle>

                        <DialogContent>
                            <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>

                                <TextField
                                    required
                                    autoFocus
                                    margin="dense"
                                    id="departmentName"
                                    name="departmentName"
                                    label="Department name"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "departmentName")}
                                    value={this.state.fields["departmentName"]}
                                    error={this.state.errorColor.departmentName}
                                    helperText={this.state.errors.departmentName}


                                />

                                <TextField
                                    required
                                    margin="dense"
                                    id="description"
                                    name="description"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "description")}
                                    value={this.state.fields["description"]}
                                    error={this.state.errorColor.description}
                                    helperText={this.state.errors.description}
                                />


                                <FormControl fullWidth required error={this.state.errorColor.headedByUserId}>
                                    <InputLabel htmlFor="headedByUserId">Headed By</InputLabel>
                                    <Select
                                        required
                                        inputProps={{
                                            name: 'headedByUserId',
                                            id: 'headedByUserId',
                                        }}
                                        onChange={this.handleChange.bind(this, "headedByUserId")}
                                        value={this.state.fields["headedByUserId"]}

                                    >
                                        <MenuItem disabled value="select" >
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


                    <Dialog
                        open={this.state.openDeleteDialog}
                        onClose={this.handleDeleteClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        {/* <DialogTitle id="alert-dialog-title">Warning!</DialogTitle> */}
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleDeleteClose} color="primary">
                                No
                            </Button>
                            <Button onClick={this.handleDeleteDialog} color="primary" autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>


                    <EnhancedTable title="Department"
                        order={order}
                        orderBy={orderBy}
                        selected={selected}
                        data={this.state.data}
                        // data={this.props.departments.data}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rows={rows}
                        onRowEdit={this.handleEdit}
                        onRowDelete={this.handleDelete}></EnhancedTable>
                </div>
            </React.Fragment>
        );
    }

}

function mapStateToProps(state) {
    return {
        departments: state.departments,
        employees: state.employees
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...DepartmentActionCreators }, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Department);
