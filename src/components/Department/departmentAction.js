import axios from 'axios';
import {baseUrl} from './../../contants';
import messages from './../../messages'

export function addDepartment(formData) {
  // console.log("IN ADD DEPT ",formData);
  let data = {
    'departmentId': formData.departmentId,
    'departmentName': formData.departmentName,
    'departmentDescription': formData.description,
    'headedByUserId': formData.headedByUserId
    } 
    // TODO: MAKE AN API CALL TO BACKEND SERVER
    return (dispatch) => {
      axios({
        method: 'post',
        url: `${baseUrl}ahits/rest/departments/`,
        data
      })
        .then((response) => {
          // console.log("adding departmnet ..... ", response.data)
          // On Success Trigger this action

          dispatch({
            type: 'SUCCESS_MESSAGE',
            data:{message : messages.successMessage , error:false}
          })
        getDepartmentsApi(dispatch)
        }).catch(error  => {
          // console.log(error);
          dispatch({
              type : 'FAILURE_MESSAGE',
              data:{message : messages.errorMessage , error:true}
          })
      });
        
    }
}

function getDepartmentsApi(dispatch){
  axios({
    method: 'get',
    url: `${baseUrl}ahits/rest/departments/all`
  })
    .then((response) => {
      // console.log("getting departmnets ", response.data)
      dispatch({
        type: 'GET_DEPARTMENTS_SUCCESS',
        data: response.data
      })
    });
}
export function getDepartments() {
  return (dispatch) => {
    getDepartmentsApi(dispatch)
  }
}


export function getUsers(){
  return (dispatch) => {
  axios({
    method: 'get',
    url: `${baseUrl}ahits/rest/user/users`
  })
    .then((response) => {
      // console.log("getting users ", response.data)
      dispatch({
        type: 'GET_USERS_SUCCESS',
        data: response.data
      })
    });
  }
}

export function deleteDepartment(id){
  return (dispatch) => {
  axios({
    method: 'get',
    url: `${baseUrl}ahits/rest/departments/delete?departmentIds=${id}`,
  })
    .then((response) => {
      console.log("deleting department ", response.data)
      getDepartmentsApi(dispatch)
    });
  }
}

