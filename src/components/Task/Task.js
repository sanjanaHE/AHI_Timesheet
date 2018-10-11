import React from 'react';
import { render } from 'react-dom';
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

class Task extends React.Component {
    createData(TaskName, description) {
        this.counter += 1;
        return { id: this.counter, TaskName, description };
    }
    handleClickOpen = () => {
        this.setState({ open: true});
        var fields = {... this.state.fields};
        fields.TaskName = "";
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
        let notDeletedArr = [];
        this.state.data.map(eachData => {
            if(rowData.id != eachData.id){
                notDeletedArr.push(eachData);
            }
            this.setState({data : notDeletedArr})
        })
    }
    handleValidation(){
        let fields = this.state.fields;
        let errors = {};
        let formIsValid = true;

        //Name
        if(!fields["name"]){
           formIsValid = false;
           errors["TaskName"] = "This field is required";
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
                data: [...this.state.data, this.createData(this.state.fields.TaskName, this.state.fields.description, this.state.fields.headedBy)]
            })
            this.setState({ open: false });
        }
     }
    constructor(props) {
        super(props);
        this.counter = 0;
        this.state = {
            isEditDialog: false,
            fields : {},
            errors : {
                TaskNameError : false,
                errorRequired : "This field is required"
            },
            open: false, //for dialog open
            order: 'asc',
            orderBy: 'headedBy',
            selected: [],
            data: [
                this.createData('Testing', 'writing test cases'),
                this.createData('Web development', 'designing UI'),
                this.createData('DevOPs', 'Basic setup'),
                this.createData('Database management', 'Maintainence')
            ],
            page: 0,
            rowsPerPage: 5,
            title: 'Task',
            rows: [
                { id: 'index', numeric: false, disablePadding: true, label: 'Index' },
                { id: 'TaskName', numeric: false, disablePadding: true, label: 'Task Name' },
                { id: 'description', numeric: false, disablePadding: true, label: 'Description' },
                { id: 'actions', numeric: false, disablePadding: true, label: 'Actions' }

            ]
            
        };
    }

    render() {
        const { data, title, order, orderBy, selected, rowsPerPage, page, rows } = this.state;
        return (
            <div style={{margin : "2%"}}>
                <h1>Tasks</h1>
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
                 Task</DialogTitle>
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
                    id="TaskName"
                    label="Task name"
                    type="text"
                    fullWidth
                    // value= {this.state.TaskName}
                    // onChange={this.handleTaskNameChange}
                    onChange={this.handleChange.bind(this, "TaskName")} 
                    value={this.state.fields["TaskName"]}
                    error={this.state.errors.TaskNameError}
                    helperText={this.state.errors.errorRequired}
                    />
                    {/* <FormHelperText error = {this.state.errors.TaskNameError}>This field is required</FormHelperText> */}
                    <TextField
                    required
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    fullWidth
                    // value= {this.state.description}
                    // onChange={this.handleDescriptionChange}
                    onChange={this.handleChange.bind(this, "description")} 
                    value={this.state.fields["description"]}
                    />
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
                <EnhancedTable title="Task"
                    order={order}
                    orderBy={orderBy}
                    selected={selected}
                    data={data}
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

export default Task;

