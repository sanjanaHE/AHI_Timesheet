import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ActionCreators from './projectAction'
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


class Project extends React.Component {
    componentDidMount(){
        // Fetch Data for Department
        this.props.actions.getProjects();
        this.props.actions.getUsers();
    }
    handleClickOpen = () => {
        this.setState({ open: true});
        var fields = {... this.state.fields};
        fields.ProjectName = "";
        fields.description = "";
        fields.headedBy = "";
        this.setState({fields});
    };

    handleClose = () => {
        this.setState({ open: false });
    };


    handleEdit = (rowData) => {

        console.log("DATA",rowData)
        this.setState({fields : rowData})
        this.setState({ open: true});
        this.setState({isEditDialog : true})
    }
    handleDelete = (rowData) => {
        this.props.actions.deleteProject(rowData.projectId)
    }
    handleValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if(!fields["name"]){
           formIsValid = false;
           errors["ProjectName"] = "This field is required";
        }
   }
    handleChange = (field, e) =>{         
        let fields = this.state.fields;
        fields[field] = e.target.value;        
        this.setState({fields});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.isEditDialog) {
            this.props.actions.addProject(this.state.fields)
        } else {
            let fields = this.state.fields;
            fields.departmentId = null;
            this.setState({fields})
            this.props.actions.addProject(this.state.fields)
            }
            this.setState({ open: false });
        }
     
    constructor(props) {
        super(props);
        this.counter = 0;
        this.state = {
            isEditDialog: false,
            fields : {},
            errors : {
                ProjectNameError : false,
                errorRequired : "This field is required"
            },
            open: false, //for dialog open
            order: 'asc',
            orderBy: 'headedBy',
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
            <div style={{margin : "2%"}}>
                <h1>Projects</h1>
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
                 Project</DialogTitle>
                <DialogContent>
                
                    <form  noValidate autoComplete="off" onSubmit={this.handleSubmit}>

                    <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="projectName"
                    label="Project name"
                    type="text"
                    fullWidth
                    // value= {this.state.ProjectName}
                    // onChange={this.handleProjectNameChange}
                    onChange={this.handleChange.bind(this, "projectName")} 
                    value={this.state.fields["projectName"]}
                    error={this.state.errors.ProjectNameError}
                    helperText={this.state.errors.errorRequired}
                    />
                    {/* <FormHelperText error = {this.state.errors.ProjectNameError}>This field is required</FormHelperText> */}
                    <TextField
                    required
                    margin="dense"
                    id="projectDescription"
                    label="Description"
                    type="text"
                    fullWidth
                    // value= {this.state.description}
                    // onChange={this.handleDescriptionChange}
                    onChange={this.handleChange.bind(this, "projectDescription")} 
                    value={this.state.fields["projectDescription"]}
                    />
                  <FormControl fullWidth required>
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
                    </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                    Cancel
                    </Button>
                    <Button type = "submit" onClick={this.handleSubmit} color="primary">
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
                    onRowEdit = {this.handleEdit}
                    onRowDelete = {this.handleDelete}
                    ></EnhancedTable>
            </div>
        );
    }

}

function mapStateToProps(state){
    return {
        projects: state.projects,
        employees : state.employees
    }
}

function mapDispatchToProps(dispatch){
    return {
        actions: bindActionCreators({...ActionCreators}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Project);
