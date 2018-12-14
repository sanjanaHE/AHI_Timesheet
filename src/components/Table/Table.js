import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Grid from '@material-ui/core/Grid';


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const CustomTableCell = withStyles(theme => ({
  head: {
    // backgroundColor: theme.palette.common.black,
    // color: theme.palette.common.white,
    // backgroundColor: '#BDBDBD',
    color: theme.palette.common.black,
    fontSize: 16,
    fontWeight:"bold"
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, rows } = this.props;
    return (
      <TableHead>
        <TableRow>
          {/* <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell> */}
          {rows.slice(1).map(row => {
            return (
              <CustomTableCell
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel style={{ color: (orderBy === row.id) ? "black" : "black" }}
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </CustomTableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, title } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
        ) : (
            <Typography variant="title" id="tableTitle">
              {title}
            </Typography>
          )}
      </div>
      <div className={classes.spacer} />
      {/* <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) :
         (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )
        }
      </div> */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '90%',
    display: "inline-block",
    marginTop: theme.spacing.unit * 1,
  },
  table: {
    minWidth: 720,
    // "table-layout":"fixed"
  },
  tableWrapper: {
    overflowX: 'auto',
    overflowY: 'auto',
    height: '50vh',
    [theme.breakpoints.up('xl')]: {
      overflowX: 'hidden',
      height: '75vh',
      overflowY: 'auto',
    },
    [theme.breakpoints.up('lg') && theme.breakpoints.down('xl')]: {
      overflowX: 'hidden',
      height: '57vh',
      overflowY: 'auto',
    },
    [theme.breakpoints.up('md') && theme.breakpoints.down('lg')]: {
      overflowX: 'hidden',
      height: '52vh',
      overflowY: 'auto',
    },
    [theme.breakpoints.up('sm') && theme.breakpoints.down('md')]: {
      overflowX: 'auto',
      overflowY: 'auto',
      height: '52vh',
    },
    [theme.breakpoints.up('xs') && theme.breakpoints.down('sm')]: {
      overflowX: 'auto',
      overflowY: 'auto',
      height: '50vh',
    },
    [ theme.breakpoints.down('sm')]: {
      overflowX: 'auto',
      overflowY: 'auto',
      height: '45vh',
    }
  },
 
  tableWrapperHead: {
    height: '3em'
  },
  
});
class EnhancedTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: 'asc',
      orderBy: this.props.orderBy,
      selected: [],
      page: 0,
      rowsPerPage: this.props.rowsPerPage || 5,
      query: '',
      columnToQuery:'',
      enableSearch:true
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: this.props.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;


 Form(classes,rows) {
    return (<form style={{ display: 'flex' }}>
    <Grid container spacing = {8} style={{marginBottom:"1%"}}>
      <Grid item md sm xs>
      </Grid>
      <Grid item md={2} sm={2} xs={2}>
        <FormControl fullWidth>
                <InputLabel htmlFor="SearchBy">Search by</InputLabel>
                <Select
                  value={this.state.columnToQuery}
                  onChange={(event)=>{this.setState({columnToQuery:event.target.value,enableSearch: false})}}
                  inputProps={{
                    name: 'SearchBy',
                    id: 'SearchBy',
                  }}
                >
                {rows.map((row,index)=>{
                  if(index != 0 && index != (rows.length-1))
                  return <MenuItem value={row.id}>{row.label}</MenuItem>
                })}
                </Select>
                
          </FormControl>
        </Grid>
        <Grid item md={3} sm={3} xs={3}>
          <TextField
                    disabled = {this.state.enableSearch}
                    id="query"
                    name="query"
                    label="Search"
                    type="text"
                    onChange={e=>this.setState({ query: e.target.value.toLowerCase()})}
                    value={this.state.query}
                />
        </Grid>
      </Grid>
    </form>)
  }
  render() {
    const { classes, data, rows } = this.props;
    let columns = rows.map(ele => { return (ele.id) })
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    let newData = this.state.query ? 
      data.filter(x => x[this.state.columnToQuery].toLowerCase().includes(this.state.query)):data
    return (
     
      <Paper className={classes.root}>
      {/* for search by field */}
      {this.Form(classes,rows)} 
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <div className={classes.tableWrapper}>
          {/* <div className={classes.tableWrapperHead}> */}

          <Table className={classes.table} aria-labelledby="tableTitle">

            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              rows={rows}
            />
            {/* </Table>
        </div>
        <div className={classes.tableWrapper}>
          <Table > */}
            <TableBody>
              {stableSort(newData, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  // console.log("COLUMNS  ",n)
                  return (
                    <TableRow
                      hover
                      // onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      selected={isSelected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell> */}
                      {/* component="th" scope="row" padding="none" */}

                      {Object.keys(n).map(m => {
                        // console.log(m)
                        if (columns.includes(m)) {
                          return (
                            <CustomTableCell >{n[m]}</CustomTableCell>
                          )
                        }
                        else {
                          return null
                        }

                      })}
                      <CustomTableCell>
                        <Tooltip title="Edit">
                          <IconButton aria-label="Edit" className={classes.button} onClick={() => this.props.onRowEdit(n)}>
                            <Icon>edit_icon</Icon>
                          </IconButton>
                        </Tooltip>

                        {this.props.isDeleteButtonRequired == "false" ? null :
                          <Tooltip title="Delete"><IconButton aria-label="Delete" className={classes.button} onClick={() => this.props.onRowDelete(n)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton></Tooltip>
                        }

                      </CustomTableCell>
                      {/* <TableCell>Delete</TableCell> */}
                      {/* <TableCell>{n.departmentName}</TableCell>
                      <TableCell >{n.description}</TableCell>
                      <TableCell >{n.headedBy}</TableCell> */}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <CustomTableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {/* </Table>
        </div> */}
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);
