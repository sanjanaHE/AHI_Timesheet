import axios from 'axios';
import {baseUrl} from './../../contants';
import messages from './../../messages'

export function addTask(formData,empId) {
  // console.log("IN ADD TASK ",formData);
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
          dispatch({
            type: 'SUCCESS_MESSAGE',
            data:{message : messages.successMessage ,error:false}
          })
          getTasksApi(dispatch,empId)
        }).catch(error  => {
          // console.log(error);
          dispatch({
              type : 'FAILURE_MESSAGE',
              data:{message :  messages.errorMessage ,error:true}
          })
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
      // console.log("deleting tasks ", response.data)
      getTasksApi(dispatch,empId)
    });
  }
}

