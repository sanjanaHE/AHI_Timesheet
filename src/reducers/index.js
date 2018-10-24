import { combineReducers } from 'redux';

// Import all reducers here and add them as a property to the dictionary below
import departmentReducer from './departmentReducer';
import loginReducer from './loginReducer';
import employeeReducer from './employeeReducer';
import projectReducer from './projectReducer';
import taskReducer from './taskReducer';
import timesheetReducer from './timesheetReducer';
import logoutReducer from './logoutReducer'
const rootReducer = combineReducers({
    departments: departmentReducer,
    login : loginReducer,
    employees : employeeReducer,
    projects : projectReducer,
    tasks:taskReducer,
    timesheet:timesheetReducer,
    logout:logoutReducer
    })

export default rootReducer