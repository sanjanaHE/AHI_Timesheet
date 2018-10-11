import axios from 'axios';

export function addDepartment(formData) {
  console.log("IN ADD DEPT ",formData);
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
        url: 'http://localhost:6090/ahits/rest/departments/',
        data
      })
        .then((response) => {
          console.log("adding departmnet ..... ", response.data)
          // On Success Trigger this action

        //   dispatch({
        //     type: 'ADD_DEPARTMENT_SUCCESS',
        //     data:response.data
        //   })
        getDepartmentsApi(dispatch)
        });
        
    }
}

export function removeDepartment(id) {
  return (dispatch) => {
    dispatch({
      type: 'REMOVE_DEPARTMENT',
      data: id
    })
  }
}

function getDepartmentsApi(dispatch){
  axios({
    method: 'get',
    url: 'http://localhost:6090/ahits/rest/departments/all'
  })
    .then((response) => {
      console.log("getting departmnets ", response.data)
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

export function login(data){
  console.log("in login action ", data)
  // let creds = new FormData();

  // creds.append('username', data.username);
  // creds.append('password', data.password);
  // return (dispatch) => {
  //   axios({
  //     method: 'post',
  //     url: 'http://localhost:6090/ahits/login',
  //     creds
  //   })
    
      // .then((response) => {
      //   console.log("LOGIN POST ", response.data)
      //   dispatch({
      //     type: 'LOGIN_SUCCESS',
      //     data: response.data
      //   })
      // });
      const newdata = {
        username : data.username,
        password :  data.password
      }
      return (dispatch) => {
      axios.post('http://localhost:6090/ahits/login',{newdata}).then(response => {
        console.log(response);
           dispatch({
          type: 'LOGIN_SUCCESS',
          data: response.data
        })
    })
  }
  
}

export function getUsers(){
  return (dispatch) => {
  axios({
    method: 'get',
    url: 'http://localhost:6090/ahits/rest/user/users'
  })
    .then((response) => {
      console.log("getting users ", response.data)
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
    url: 'http://localhost:6090/ahits/rest/departments/delete?departmentIds=' + id,
  })
    .then((response) => {
      console.log("deleting department ", response.data)
      getDepartmentsApi(dispatch)
    });
  }
}

