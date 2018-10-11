import axios from 'axios';
import baseUrl from './../../constants';
function getEmployeesApi(dispatch){
    axios({
      method: 'get',
      url: `{$baseUrl}ahits/rest/employees/all`
    })
      .then((response) => {
        console.log("getting employees ", response.data)
        dispatch({
          type: 'GET_EMPLOYEES_SUCCESS',
          data: response.data
        })
      });
  }
  export function getEmployeesApi() {
    return (dispatch) => {
      getDepartmentsApi(dispatch)
    }
  }