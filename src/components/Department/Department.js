import React, { Fragment } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

class Department extends React.Component {
    componentDidMount(){
        // Fetch Data for Department
        this.props.actions.getDepartments();
        this.props.actions.getUsers();
    }
    
    handleClickOpen = () => {
        this.setState({ open: true});
        var fields = {...this.state.fields};
        fields.departmentName = "";
        fields.description = "";
        fields.headedByUserId = "";
        this.setState({fields});
        this.setState({isEditDialog : false})
    };

    handleClose = () => {
        this.setState({ open: false });
    };
    handleEdit = (rowData) => {
        console.log("EDIT DEPT DATA",rowData)
        // this.props.actions.addDepartment(rowData.departmentId)
        this.setState({fields : rowData})
        this.setState({ open: true});
        this.setState({isEditDialog : true})
    }
    handleDelete = (rowData) => {
        // let notDeletedArr = [];
        // this.state.data.map(eachData => {
        //     if(rowData.id != eachData.id){
        //         notDeletedArr.push(eachData);
        //     }
        //     this.setState({data : notDeletedArr})
        // })
        console.log("row data id ",rowData)
        this.props.actions.deleteDepartment(rowData.departmentId)
    }

    handleValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if(!fields["name"]){
           formIsValid = false;
           errors["departmentName"] = "This field is required";
        }

        // if(typeof fields["name"] !== "undefined"){
        //    if(!fields["name"].match(/^[a-zA-Z]+$/)){
        //       formIsValid = false;
        //       errors["name"] = "Only letters";
        //    }        
        // }

        //Email
    //     if(!fields["email"]){
    //        formIsValid = false;
    //        errors["email"] = "Cannot be empty";
    //     }

    //     if(typeof fields["email"] !== "undefined"){
    //        let lastAtPos = fields["email"].lastIndexOf('@');
    //        let lastDotPos = fields["email"].lastIndexOf('.');

    //        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
    //           formIsValid = false;
    //           errors["email"] = "Email is not valid";
    //         }
    //    }  

    //    this.setState({errors: errors});
    //    return formIsValid;
   }
    handleChange = (field, e) =>{         
        let fields = this.state.fields;
        fields[field] = e.target.value;        
        this.setState({fields});
    }

    handleSubmit = (event) => {
        //Make a network call somewhere
        event.preventDefault();
       
        // if(this.handleValidation()){
        //     alert("Form submitted");
        //     this.setState({ open: false });
        //  }else{
        //     alert("Form has errors.")
        //  }
        if(this.state.fields.departmentName == ""){
            this.state.errors.departmentNameError= true;
            this.setState({ open: true });
        }
        else{
            
            if(this.state.isEditDialog){
                // let editArr = [];
                // this.state.data.map(eachData => {
                //     if(eachData.id == this.state.fields.id){
                //         editArr.push(this.state.fields);
                //     }
                //     else{
                //         editArr.push(eachData);
                //     }
                // })
                // this.setState({data : editArr})
                console.log("Fields in EDIT mode ",this.state.fields);
                this.props.actions.addDepartment(this.state.fields)
            } else  {
                // console.log("department added with state ",this.state);
                this.state.errors.departmentNameError= false;

                console.log(this.state.fields)
                // this.setState({data : [...this.state.data,this.createData(this.state.fields.departmentName, 
                //     this.state.fields.description,
                //     this.state.fields.headedBy
                // )]})
                let fields = this.state.fields;
                fields.departmentId = null;
                this.setState({fields})
                this.props.actions.addDepartment(this.state.fields)
                // this.props.actions.getDepartments();
            }
            this.setState({ open: false }); 
        }
     }
    constructor(props) {
        super(props);
        this.counter = 0;
        this.state = {
            isEditDialog : false,
            fields : {},
            errors : {
                departmentNameError : false,
                errorRequired : "This field is required"
            },
            open: false, //for dialog open
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
                <Header>
                </Header>
            
                <div style={{margin : "2%"}}>
                    <h1>Departments</h1>
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
                    Department</DialogTitle>

                    <DialogContent>
                        {/* <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send
                        updates occasionally.
                        </DialogContentText> */}
                        <form  noValidate autoComplete="off" onSubmit={this.handleSubmit}>

                        <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="departmentName"
                        label="Department name"
                        type="text"
                        fullWidth
                        onChange={this.handleChange.bind(this, "departmentName")} 
                        value={this.state.fields["departmentName"]}
                        // error=
                        helperText={this.state.errors.errorRequired}
                        />

                        <TextField
                        required
                        margin="dense"
                        id="description"
                        label="Description"
                        type="text"
                        fullWidth
                        onChange={this.handleChange.bind(this, "description")} 
                        value={this.state.fields["description"]}
                        />


                        <FormControl fullWidth required>
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
                    <EnhancedTable title="Department"
                        order={order}
                        orderBy={orderBy}
                        selected={selected}
                        data={this.props.departments.data}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rows={rows}
                        onRowEdit = {this.handleEdit}
                        onRowDelete = {this.handleDelete}></EnhancedTable>
                </div>
            </React.Fragment>
        );
    }

}

function mapStateToProps(state){
    return {
        departments: state.departments,
        employees : state.employees
    }
}

function mapDispatchToProps(dispatch){
    return {
        actions: bindActionCreators({...DepartmentActionCreators}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Department);
