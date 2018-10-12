function createData(departmentId, departmentName, description, headedBy, headedByUserId) {
  //using params same as in api input
  return {departmentId, departmentName, description, headedBy ,headedByUserId};
}


let initialData = []
// initialData.push(createData('DevOPs', 'DevOPs', 'AH'))
// initialData.push(createData('Web development', 'Web development', 'AH'))
// initialData.push(createData('Andriod', 'Andriod', 'AH'))
// initialData.push(createData('Database management', 'Database management', 'AH'))

const initialState = {"data": initialData, "hasError": false}
function transformDataReceivedFromServer(data) {
  let initialData = []
  // console.log("transformDataReceivedFromServer   ",data)
  data.map(element => {
    initialData.push(createData(element.departmentId, 
      element.departmentName, 
      element.departmentDescription, 
      element.headedBy,
      element.headedByUserId))
  });
  return initialData;
}

export default function departmentReducer(state = initialState, action) {
  
    switch (action.type) {
      case 'GET_DEPARTMENTS_SUCCESS': 
      // console.log(state.data);
      // console.log(action.data)
      return { data: transformDataReceivedFromServer(action.data), hasError: false}

      case 'ADD_DEPARTMENT_SUCCESS': 

      // console.log(state.data)
      // return { data : [...state.data, action.data], hasError: false}
        // return { data: [...state.data, createData(action.data.departmentId, action.data.departmentName, 
        //   action.data.departmentDescription, action.data.headedByUserId)], hasError: false}

      case 'EDIT_DEPARTMENT_SUCCESS': 

      case 'DELETE_DEPARTMENT_SUCCESS':

      case 'ADD_DEPARTMENT_FAILURE': 

      case 'EDIT_DEPARTMENT_FAILURE': 

      case 'DELETE_DEPARTMENT_FAILURE': 

      case 'GET_DEPARTMENTS_FAILURE': return state
      
      default:
        return state
    }
  }