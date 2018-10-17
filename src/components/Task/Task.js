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


class Task extends React.Component {
    componentDidMount(){
        this.props.login_actions.getLoggedUser();
        console.log(this.props); //not accessible
        if(this.props.login.data == undefined){
            this.props.actions.getTasks(this.props.login.data.id);
        }
    }

    componentWillReceiveProps(nextProps){
        // console.log(nextProps);
        if(this.props.login.data.length==0)
            this.props.actions.getTasks(nextProps.login.data.id);
    }
    handleClickOpen = () => {
        this.setState({ open: true});
        var fields = {... this.state.fields};
        fields.taskName = "";
        fields.taskDescription = "";
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
        this.props.actions.deleteTask(rowData.taskId,this.props.login.data.id)
    }

    handleChange = (field, e) =>{         
        let fields = this.state.fields;
        fields[field] = e.target.value;        
        this.setState({fields});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.isEditDialog) {
            this.props.actions.addTask(this.state.fields,this.props.login.data.id)
        } else {
            let fields = this.state.fields;
            fields.taskId = null;
            this.setState({fields})
            this.props.actions.addTask(this.state.fields,this.props.login.data.id)
            }
            this.setState({ open: false });
        }
     
    constructor(props) {
        super(props);
        this.counter = 0;
        this.state = {
            isEditDialog: false,
            fields : {},
            errors : {},
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
        const { tasks ,login} = this.props;
        // console.log(this.props.login.data.id)
        return (
            <React.Fragment>
                <Header>
                </Header>
                <div style={{margin : "2%"}}>
                    <h1>Tasks</h1>
                    <Tooltip title="Add task">
                        <Button variant="fab" color="primary" aria-label="Add" style={{ float: "right" }} onClick={this.handleClickOpen} >
                            <AddIcon />
                        </Button>
                    </Tooltip>
                    {/* <Button variant="contained" color="primary">
                        Add
                        <AddIcon />
                    </Button> */}
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title"
                        >
                    <DialogTitle id="form-dialog-title">
                    { this.state.isEditDialog ? 'Edit ' : 'Add '}
                    Task</DialogTitle>
                    <DialogContent>
                    
                        <form  noValidate autoComplete="off" onSubmit={this.handleSubmit}>

                        <TextField
                        required
                        autoFocus
                        margin="dense"
                        id="taskName"
                        label="Task name"
                        type="text"
                        fullWidth
                        onChange={this.handleChange.bind(this, "taskName")} 
                        value={this.state.fields["taskName"]}
                        />
                        {/* <FormHelperText error = {this.state.errors.TaskNameError}>This field is required</FormHelperText> */}
                        <TextField
                        required
                        margin="dense"
                        id="taskDescription"
                        label="Description"
                        type="text"
                        fullWidth
                        onChange={this.handleChange.bind(this, "taskDescription")} 
                        value={this.state.fields["taskDescription"]}
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
                        data={this.props.tasks.data}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        rows={rows}
                        onRowEdit = {this.handleEdit}
                        onRowDelete = {this.handleDelete}
                        ></EnhancedTable>
                </div>
            </React.Fragment>
        );
    }

}

function mapStateToProps(state){
    return {
        tasks: state.tasks,
        login: state.login
    }
}

function mapDispatchToProps(dispatch){
    return {
        actions: bindActionCreators({...ActionCreators}, dispatch),
        login_actions: bindActionCreators(LoginActionCreators, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Task);
