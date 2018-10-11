import { combineReducers } from 'redux';

// Import all reducers here and add them as a property to the dictionary below
import departmentReducer from './departmentReducer'
import loginReducer from './loginReducer';
import employeeReducer from './employeeReducer';

const rootReducer = combineReducers({
    departments: departmentReducer,
    login : loginReducer,
    employees : employeeReducer
    })

export default rootReducer