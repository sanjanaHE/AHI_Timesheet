function createData(taskId, taskName, taskDescription) {
    //using params same as in api input
    return {taskId, taskName, taskDescription};
  }
  
  
  let initialData = []
  const initialState = {"data": initialData, "hasError": false}
  function transformDataReceivedFromServer(data) {
    let initialData = []
    // console.log("transformDataReceivedFromServer   ",data)
    data.map(element => {
      initialData.push(createData(element.taskId, 
        element.taskName, 
        element.taskDescription))
    });
    return initialData;
  }
  
  export default function taskReducer(state = initialState, action) {
    
      switch (action.type) {
        case 'GET_TASKS_SUCCESS': 
        // console.log(state.data);
        // console.log(action.data)
        return { data: transformDataReceivedFromServer(action.data), hasError: false}
  
        case 'ADD_TASK_SUCCESS': 
  
        // console.log(state.data)
        // return { data : [...state.data, action.data], hasError: false}
          // return { data: [...state.data, createData(action.data.departmentId, action.data.departmentName, 
          //   action.data.departmentDescription, action.data.headedByUserId)], hasError: false}
  
        case 'EDIT_TASK_SUCCESS': 
  
        case 'DELETE_TASK_SUCCESS':
  
        case 'ADD_TASK_FAILURE': 
  
        case 'EDIT_TASK_FAILURE': 
  
        case 'DELETE_TASK_FAILURE': 
  
        case 'GET_TASKS_FAILURE': return state
        
        default:
          return state
      }
    }