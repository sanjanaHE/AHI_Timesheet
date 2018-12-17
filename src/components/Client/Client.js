import React from 'react';
import trim from 'trim'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ActionCreators from './clientAction';
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
});


class Client extends React.Component {
    componentDidMount() {
        // Fetch Data for Department
        this.props.actions.getClients();
    };

    handleClickOpen = () => {
        // console.log("in handle click open")
        this.setState({ open: true });
        var fields = { ...this.state.fields };
        fields.clientName = "";
        fields.clientDesc = "";
        fields.clientLocation = "";
        this.setState({ fields });
        this.setState({ isEditDialog: false })
        // console.log(this.state)
    };

    handleValidation() {

        let fields = this.state.fields;
        let errors = {};    //error messages
        let errorColor = {}; //true/false
        let formIsValid = true;

        if (!fields["clientName"]) {
            errorColor["clientName"] = true;    //true for error(red color will appear)
            formIsValid = false;
            errors["clientName"] = "This field is required";

        }
        else if (trim(fields["clientName"]) == '') {
            errorColor["clientName"] = true;
            formIsValid = false;
            errors["clientName"] = "Please enter valid project name";
        }
        if (!fields["clientDesc"]) {
            errorColor["clientDesc"] = true;
            formIsValid = false;
            errors["clientDesc"] = "This field is required";

        }
        else if (trim(fields["clientDesc"]) == '') {
            errorColor["clientDesc"] = true;
            formIsValid = false;
            errors["clientDesc"] = "Please enter valid description";
        }
        if (!fields["clientLocation"]) {
            errorColor["clientLocation"] = true;
            formIsValid = false;
            errors["clientLocation"] = "This field is required";

        }

        this.setState({ errors: errors });
        this.setState({ errorColor: errorColor });
        return formIsValid;
    };

    handleClose = () => {
        this.setState({ open: false });
        this.setState({ errors: {} });
        this.setState({ errorColor: {} });
    };

    handleEdit = (rowData) => {

        var fields = Object.assign({}, rowData);
        this.setState({ fields: fields })
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

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ open: true });  //dialogue box will be open
        // console.log(this.state.fields)
        if (this.state.isEditDialog) {
            //checking for validation 
            if (this.handleValidation()) {
                let fields = Object.assign({}, this.state.fields);
                this.props.actions.addClient(fields)     //edited form submission
                this.setState({ open: false });
            }

        } else {
            let fields = this.state.fields;
            fields.clientId = null;
            this.setState({ fields })
            //checking for validation 
            if (this.handleValidation()) {
                let fields = Object.assign({}, this.state.fields);
                this.props.actions.addClient(fields)    //added form submission
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
            orderBy: 'clientName',
            selected: [],
            data: [],
            page: 0,
            rowsPerPage: 5,
            title: 'Client',
            rows: [
                { id: 'index', numeric: false, disablePadding: false, label: 'Index' },
                { id: 'clientName', numeric: false, disablePadding: false, label: 'Client Name' },
                { id: 'clientDesc', numeric: false, disablePadding: false, label: 'Description' },
                { id: 'clientLocation', numeric: false, disablePadding: false, label: 'Location' },
                { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' }
            ]
        };
    }
    render() {
        const { data, title, order, orderBy, selected, rowsPerPage, page, rows } = this.state;
        const { employees } = this.props;
        const { classes, theme } = this.props;

       
        return (
            <React.Fragment>
                <SnackbarMsg/>
                <div style={{ margin: "2%" }}>
                    <h1>Clients</h1>
                    <Tooltip title="Add client">
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
                            Client</DialogTitle>
                        <DialogContent>

                            <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>

                                <TextField
                                    required
                                    autoFocus
                                    margin="dense"
                                    id="clientName"
                                    name="clientName"
                                    label="Client name"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "clientName")}
                                    value={this.state.fields["clientName"]}
                                    error={this.state.errorColor.clientName}
                                    helperText={this.state.errors.clientName}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="clientDesc"
                                    name="clientDesc"
                                    label="Description"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "clientDesc")}
                                    value={this.state.fields["clientDesc"]}
                                    error={this.state.errorColor.clientDesc}
                                    helperText={this.state.errors.clientDesc}
                                />
                                <TextField
                                    required
                                    margin="dense"
                                    id="clientLocation"
                                    name="clientLocation"
                                    label="Location"
                                    type="text"
                                    fullWidth
                                    onChange={this.handleChange.bind(this, "clientLocation")}
                                    value={this.state.fields["clientLocation"]}
                                    error={this.state.errorColor.clientLocation}
                                    helperText={this.state.errors.clientLocation}
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
                    <EnhancedTable title="Project"
                        order={order}
                        orderBy={orderBy}
                        selected={selected}
                        data={this.props.clients.data}
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
        clients: state.clients,
        snackbarMsg : state.snackbarMsg
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...ActionCreators }, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Client));


