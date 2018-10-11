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

class Project extends React.Component {
    createData(ProjectName, description, headedBy) {
        this.counter += 1;
        return { id: this.counter, ProjectName, description, headedBy };
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
                data: [...this.state.data, this.createData(this.state.fields.ProjectName, this.state.fields.description, this.state.fields.headedBy)]
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
                ProjectNameError : false,
                errorRequired : "This field is required"
            },
            open: false, //for dialog open
            order: 'asc',
            orderBy: 'headedBy',
            selected: [],
            data: [
                this.createData('DevOPs', 'DevOPs', 'AH'),
                this.createData('Web development', 'Web development', 'AH'),
                this.createData('Andriod', 'Andriod', 'AH'),
                this.createData('Database management', 'Database management', 'AH')
            ],
            page: 0,
            rowsPerPage: 5,
            title: 'Project',
            rows: [
                { id: 'index', numeric: false, disablePadding: true, label: 'Index' },
                { id: 'ProjectName', numeric: false, disablePadding: true, label: 'Project Name' },
                { id: 'description', numeric: false, disablePadding: true, label: 'Description' },
                { id: 'headedBy', numeric: false, disablePadding: true, label: 'Headed By' },
                { id: 'actions', numeric: false, disablePadding: true, label: 'Actions' }

            ]
            
        };
    }

    render() {
        const { data, title, order, orderBy, selected, rowsPerPage, page, rows } = this.state;
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
                    {/* <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send
                    updates occasionally.
                    </DialogContentText> */}
                    <form  noValidate autoComplete="off" onSubmit={this.handleSubmit}>

                    <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="ProjectName"
                    label="Project name"
                    type="text"
                    fullWidth
                    // value= {this.state.ProjectName}
                    // onChange={this.handleProjectNameChange}
                    onChange={this.handleChange.bind(this, "ProjectName")} 
                    value={this.state.fields["ProjectName"]}
                    error={this.state.errors.ProjectNameError}
                    helperText={this.state.errors.errorRequired}
                    />
                    {/* <FormHelperText error = {this.state.errors.ProjectNameError}>This field is required</FormHelperText> */}
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
                    <TextField
                    required
                    margin="dense"
                    id="headedBy"
                    label="Headed by"
                    type="text"
                    fullWidth
                    // value= {this.state.headedBy}
                    // onChange={this.handleHeadedByChange}
                    onChange={this.handleChange.bind(this, "headedBy")} 
                    value={this.state.fields["headedBy"]}
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
                <EnhancedTable title="Project"
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

export default Project;
