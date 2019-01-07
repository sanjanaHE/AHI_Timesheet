import axios from 'axios';
import {baseUrl} from './../../contants';
let isAuthenticated = false;

export function logout(){
//   console.log("in logout action ")

      return (dispatch) => {
      axios({
          method : 'post' ,
          url:`${baseUrl}ahits/logout`
    }).then(response => {
            // console.log(response);
            dispatch({
            type: 'LOGOUT_SUCCESS',
            isAuthenticated : false,
            data:response.data
        })
    })
  }
}





