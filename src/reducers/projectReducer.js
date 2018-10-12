function createData(projectId, projectName, projectDescription, headedBy, headedByUserId) {
    //using params same as in api input
    return {projectId, projectName, projectDescription, headedBy, headedByUserId};
  }
  
  
  let initialData = []
  const initialState = {"data": initialData, "hasError": false}
  function transformDataReceivedFromServer(data) {
    let initialData = []
    // console.log("transformDataReceivedFromServer   ",data)
    data.map(element => {
      initialData.push(createData(element.projectId, 
        element.projectName, 
        element.projectDescription, 
        element.headedBy,
        element.headedByUserId))
    });
    return initialData;
  }
  
  export default function projectReducer(state = initialState, action) {
    
      switch (action.type) {
        case 'GET_PROJECTS_SUCCESS': 
        // console.log(state.data);
        // console.log(action.data)
        return { data: transformDataReceivedFromServer(action.data), hasError: false}
  
        case 'ADD_PROJECT_SUCCESS': 
  
        // console.log(state.data)
        // return { data : [...state.data, action.data], hasError: false}
          // return { data: [...state.data, createData(action.data.departmentId, action.data.departmentName, 
          //   action.data.departmentDescription, action.data.headedByUserId)], hasError: false}
  
        case 'EDIT_PROJECT_SUCCESS': 
  
        case 'DELETE_PROJECT_SUCCESS':
  
        case 'ADD_PROJECT_FAILURE': 
  
        case 'EDIT_PROJECT_FAILURE': 
  
        case 'DELETE_PROJECT_FAILURE': 
  
        case 'GET_PROJECTS_FAILURE': return state
        
        default:
          return state
      }
    }