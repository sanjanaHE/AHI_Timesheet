let initialData = []
const initialState = {"data": initialData, "hasError": false}
function createData(id,loginId,firstName, lastName, dob, designation, joiningDate, role, supervisorId,supervisorName, location,email) {
    return {id,loginId,firstName, lastName, dob, designation, joiningDate, role, supervisorId,supervisorName, location,email};
}
function transformDataReceivedFromServer(data) {
    let initialData = []
    // console.log("transformDataReceivedFromServer   ",data)
    data.map(element => {
      initialData.push(createData(
        element.id,
        element.loginId, 
        element.firstName, 
        element.lastName, 
        element.dob,
        element.designation,
        element.joiningDate,
        element.role,
        element.supervisorId,
        element.supervisorName,
        element.location,
        element.email
        
        // element.loginId
    ))
    });
    return initialData;
  }
export default function employeeReducer(state = initialState, action){
    switch (action.type) {
        
        case 'GET_USERS_SUCCESS': //used for 'headed by' menu options in departments
            // console.log("GET USER SUCCESS")
            return {data : action.data , hasError : false}
        case 'GET_EMPLOYEES_SUCCESS':
            // console.log("GET_EMPLOYEES_SUCCESS")
            return { data: transformDataReceivedFromServer(action.data), hasError: false}
        case 'ADD_EMPLOYEE_SUCCESS':
        case 'EDIT_EMPLOYEE_SUCCESS':
        case 'DELETE_EMPLOYEE_SUCCESS':
            return state
        default:
        return state
    }
}
