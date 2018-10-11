let initialData = []
const initialState = {"data": initialData, "hasError": false}
function createData(departmentId, departmentName, description, headedBy, headedByUserId) {
    return {departmentId, departmentName, description, headedBy ,headedByUserId};
  }
function transformDataReceivedFromServer(data) {
    let initialData = []
    console.log("transformDataReceivedFromServer   ",data)
    data.map(element => {
      initialData.push(createData(element.departmentId, 
        element.departmentName, 
        element.departmentDescription, 
        element.headedBy,
        element.headedByUserId))
    });
    return initialData;
  }
export default function employeeReducer(state = initialState, action){
    switch (action.type) {
        case 'GET_USERS_SUCCESS':
            console.log("GET USER SUCCESS")
            return {data : action.data , hasError : false}
        case 'GET_EMPLOYEES_SUCCESS':
            console.log("GET_EMPLOYEES_SUCCESS")
            return { data: transformDataReceivedFromServer(action.data), hasError: false}
        default:
        return state
    }
}
