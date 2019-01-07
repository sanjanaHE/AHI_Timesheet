import axios from 'axios';
import {baseUrl} from './../../contants';
import moment from 'moment';
import messages from './../../messages'

function getEmployeesApi(dispatch){
    axios({
      method: 'get',
      url:  `${baseUrl}ahits/rest/user/users`
    })
      .then((response) => {
        dispatch({
          type: 'GET_EMPLOYEES_SUCCESS',
          data: response.data
        })
      });
}


  export function getEmployees() {
    return (dispatch) => {
        getEmployeesApi(dispatch)
    }
  }


  export function addEmployee(formData,userId) {
    
    let data = {
      'id':formData.id,
      'loginId': formData.loginId,
      'firstName': formData.firstName,
      'lastName': formData.lastName,
      'dob': moment(formData.dob).format('YYYY-MM-DD'),
      'designation': formData.designation,
      'joiningDate': moment(formData.joiningDate).format('YYYY-MM-DD'),
      'role': formData.role,
      'supervisorId': formData.supervisorId,
      'location': formData.location,
      'email':formData.email
      } 
      // console.log("IN ADD EMPL ",data,userId);
      // TODO: MAKE AN API CALL TO BACKEND SERVER
      return (dispatch) => {
        axios({
          method: 'post',
          url: `${baseUrl}ahits/rest/user/adduser/${userId}`,
          data
        })
          .then((response) => {
            // console.log("adding employee ..... ", response.data)
            dispatch({
              type: 'SUCCESS_MESSAGE',
              data:{message : messages.successMessage ,error:false}
            })
            // On Success Trigger this action
            getEmployeesApi(dispatch)
          }).catch(error  => {
            // console.log(error);
            dispatch({
                type : 'FAILURE_MESSAGE',
                data:{message :  messages.errorMessage ,error:true}
            })
        });
          
      }
  }
  