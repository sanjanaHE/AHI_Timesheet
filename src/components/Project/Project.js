import React from 'react';
import trim from 'trim'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from './projectAction';
import * as ClientActionCreators from './../Client/clientAction';

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
import SelectN from 'react-select';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import components from './../common/common'; //used for react-select
import SnackbarMsg from './../SnackbarMsg/SnackbarMsg'

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
    dialogPaper: { overflow: 'visible' }
});


class Project extends React.Component {
    componentDidMount() {
        // Fetch Data for Department
        this.props.actions.getProjects();
        this.props.actions.getUsers();
        this.props.client_actions.getClients();
    }
    handleClickOpen = () => {
        // console.log("in handle click open")
        this.setState({ open: true });
        var fields = { ...this.state.fields };
        fields.projectName = "";
        fields.projectDescription = "";
        fields.headedByUserId = "";
        fields.clientId = "";
        this.setState({ fields });
        this.setState({ isEditDialog: false })
        // console.log(this.state.fields)
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
        if (!fields["clientId"]) {
            errorColor["clientId"] = true;
            formIsValid = false;
            errors["clientId"] = "This field is required";

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
        // console.log(rowData)
        var fields = Object.assign({}, rowData);
        fields.headedByUserId = { label: rowData.headedBy, value: rowData.headedByUserId }
        this.setState({ fields: fields })
        this.setState({ open: true });
        this.setState({ isEditDialog: true })
    }
    handleDelete = (rowData) => {
        this.props.actions.deleteProject(rowData.projectId)
    }

    handleChangeDropdown = (field, e) => {
        let fields = this.state.fields;
        if(e){
            fields[field] = { value: e.value, label: e.label };
            this.setState({ fields });
        }
        else{
            fields[field] = "";
        }

        //setting errors and errorcolor in state
        let errorColor = this.state.errorColor;
        let errors = this.state.errors;

        if (fields[field] == "") {
            errorColor['headedByUserId'] = true;
            errors['headedByUserId'] = "This field is required";
            this.setState({ errorColor: errorColor, errors: errors })
        }
        else {
            // console.log(e)
            // console.log(errorColor)
            errorColor['headedByUserId'] = false;
            errors['headedByUserId'] = "";
            this.setState({ errorColor: errorColor, errors: errors })
        }
        // console.log(this.state.errorColor.headedByUserId)
    }

    handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({ fields });
        // console.log(this.state.fields)

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
                let fields = Object.assign({}, this.state.fields);
                fields['headedByUserId'] = this.state.fields.headedByUserId.value; //coverting field to value from label and value
                this.props.actions.addProject(fields)     //edited form submission
                this.setState({ open: false });
            }

        } else {
            let fields = this.state.fields;
            fields.projectId = null;
            this.setState({ fields })
            //checking for validation 
            if (this.handleValidation()) {
                let fields = Object.assign({}, this.state.fields);
                fields['headedByUserId'] = this.state.fields.headedByUserId.value;
                this.props.actions.addProject(fields)    //added form submission
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
                { id: 'headedBy', numeric: false, disablePadding: false, label: 'Owner' },
                { id: 'clientName', numeric: false, disablePadding: false, label: 'Client Name' },
                { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
            ]
        };
    }

    render() {
        const { data, title, order, orderBy, selected, rowsPerPage, page, rows } = this.state;
        const { employees,clients } = this.props;
        const { classes, theme } = this.props;
        // console.log(this.state.rows)
        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
                '& input': {
                    font: 'inherit',
                },
            }),
        };
        let suggestions = employees.data.map(function (employee) {
            return { label: employee.firstName, value: employee.id };
        })
        return (
            <React.Fragment>
                <SnackbarMsg/>
                <div style={{ margin: "2%" }}>
                    <h1>Projects</h1>
                    <Tooltip title="Add project">
                        <Button variant="fab" color="secondary" aria-label="Add" style={{ float: "right" }} onClick={this.handleClickOpen} >
                            <AddIcon />
                        </Button>
                    </Tooltip>
                    <Dialog PaperProps={{ className: classes.dialogPaper }}
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title"
                        maxWidth ='sm'
                        fullWidth ='false'
                    >
                        <DialogTitle id="form-dialog-title">
                            {this.state.isEditDialog ? 'Edit ' : 'Add '}
                            Project</DialogTitle>
                        <DialogContent style={{overflow:"visible"}}>

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
                                {/* <FormControl fullWidth required  error={this.state.errorColor.headedByUserId}>
                                    <InputLabel htmlFor="headedByUserId">Owner</InputLabel>
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
                                </FormControl> */}

                                <FormControl fullWidth required  error={this.state.errorColor.clientId}>
                                    <InputLabel htmlFor="clientId">Client</InputLabel>
                                    <Select
                                        inputProps={{
                                            name: 'clientId',
                                            id: 'clientId',
                                        }}
                                        onChange={this.handleChange.bind(this, "clientId")}
                                        value={this.state.fields["clientId"]}
                                    >
                                        <MenuItem disabled value="select" selected>
                                            <em>Select</em>
                                        </MenuItem>
                                        {clients.data.map(client => {
                                            return <MenuItem key={client.clientId} value={client.clientId}>{client.clientName}</MenuItem>
                                        })
                                        }
                                    </Select>
                                    <FormHelperText>{this.state.errors.clientId}</FormHelperText>
                                </FormControl>

                                {/* <div className={classes.divider} /> */}
                                <InputLabel htmlFor="headedByUserId" style={{'color':this.state.errorColor.headedByUserId?"red":"black"}}>Owner* </InputLabel>
                                <FormControl fullWidth required error={this.state.errorColor.headedByUserId}>
                                    {/* <InputLabel htmlFor="headedByUserId"> </InputLabel> */}
                                    <SelectN
                                        inputProps={{
                                            name: 'headedByUserId',
                                            id: 'headedByUserId',
                                        }}
                                        name= "Owner"
                                        maxMenuHeight = "200"
                                        isClearable = "true"
                                        classes={classes}
                                        styles={selectStyles}
                                        options={suggestions}
                                        components={components}
                                        value={this.state.fields["headedByUserId"]}
                                        onChange={this.handleChangeDropdown.bind(this, "headedByUserId")}
                                        placeholder="Type to search "

                                    />

                                    <FormHelperText>{this.state.errors.headedByUserId}</FormHelperText>
                                </FormControl>
                                {/* <div className={classes.divider} /> */}
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
                        isDeleteButtonRequired="false"
                    ></EnhancedTable>
                </div>
            </React.Fragment>
        );
    }

}

function mapStateToProps(state) {
    return {
        projects: state.projects,
        employees: state.employees,
        clients:state.clients,
        snackbarMsg : state.snackbarMsg
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...ActionCreators }, dispatch),
        client_actions :bindActionCreators({ ...ClientActionCreators}, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Project));

