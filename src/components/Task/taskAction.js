import axios from 'axios';
import {baseUrl} from './../../contants';

export function addTask(formData,empId) {
  console.log("IN ADD TASK ",formData);
  let data = {
    'taskId': formData.taskId,
    'taskName': formData.taskName,
    'taskDescription': formData.taskDescription,
    'userId': empId
    } 
    // console.log("ADD TASK DATA" , data)
    // TODO: MAKE AN API CALL TO BACKEND SERVER
    return (dispatch) => {
      axios({
        method: 'post',
        url: `${baseUrl}ahits/api/tasks/`,
        data
      })
        .then((response) => {
          // console.log("adding tasks ..... ", response.data)
          getTasksApi(dispatch,empId)
        });
        
    }
}


function getTasksApi(dispatch,empId){
  axios({
    method: 'get',
    url: `${baseUrl}ahits/api/tasks/all/${empId}`
  })
    .then((response) => {
      // console.log("getting taskss ", response.data)
      dispatch({
        type: 'GET_TASKS_SUCCESS',
        data: response.data
      })
    });
}

export function getTasks(empId) {
    // console.log(empId)
  return (dispatch) => {
    getTasksApi(dispatch,empId)
  }
}


export function deleteTask(id,empId){
  return (dispatch) => {
  axios({
    method: 'get',
    url: `${baseUrl}ahits/api/tasks/delete?taskIds=${id}`,
  })
    .then((response) => {
      console.log("deleting tasks ", response.data)
      getTasksApi(dispatch,empId)
    });
  }
}

