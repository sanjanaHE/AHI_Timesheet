import axios from 'axios';
import {baseUrl} from './../../contants';

export function login( creds){
  console.log("in login action ",  creds)
      let data = new FormData();
      data.append('username', creds.username);
        data.append('password', creds.password); 
      return (dispatch) => {
      axios.post('http://localhost:6090/ahits/login', creds).then(response => {
        console.log(response.data);
           dispatch({
          type: 'LOGIN_SUCCESS',
          data: response.data
        })
    })
  }
}

export function getLoggedUser(){
    return (dispatch) => {
        axios.get('http://localhost:6090/ahits/rest/user/userdetails')
        .then(response => {
            console.log("GET lOGGED USER ID" , response.data)
            dispatch({
                type : 'GET_LOGGED_USER_SUCCESS',
                data : response.data
            })
        })
    }
}





