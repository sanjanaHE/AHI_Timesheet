import axios from 'axios';
import {baseUrl} from './../../contants';
let isAuthenticated = false
export function login(creds){
//   console.log("in login action ",  creds)
      let data = new FormData();
      data.append('username', creds.username);
        data.append('password', creds.password);
      return (dispatch) => {
      axios({
          method : 'post' ,
          url:`${baseUrl}ahits/login`,
          data
          
    }).then(response => {
            // console.log(response);
            dispatch({
            type: 'LOGIN_SUCCESS',
            isAuthenticated : true,
            data:response.data
        })
    }).catch(error  => {
        // console.log(error);
        dispatch({
            type : 'LOGIN_FAILURE'
        })
    })
  }
}

export function getLoggedUser(){
    return (dispatch) => {
        dispatch({
            type: 'INITIATE_GET_LOGGED_IN_USER'
        })
        axios.get(`${baseUrl}ahits/rest/user/userdetails`)
        .then(response => {
            // console.log("GET lOGGED USER ID" , response.status)
            dispatch({
                type : 'GET_LOGGED_USER_SUCCESS',
                data : response.data
            })
        }).catch(error  => {
            // console.log(error);
            dispatch({
                type : 'GET_LOGGED_USER_ERROR',
                data:error
            })
        })
    }
}





