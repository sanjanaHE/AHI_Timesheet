import axios from 'axios';
import { baseUrl } from './../../contants';


export function resetPasswordState() {
  return (dispatch) => {
    dispatch({
      type: 'RESET_CHANGE_PASSWORD'
    })
  }
}
export function changePassword(oldPassword, newPassword) {
  // console.log("IN PASSWORD CHANGE ", oldPassword, newPassword);
  let  data  =  {
    'passwordCurrent':  oldPassword,
    'password':  newPassword,
    //   'confirmPassword': formData.confirmPassword,
    //   'loginId': formData.loginId
  }
  // TODO: MAKE AN API CALL TO BACKEND SERVER
  return (dispatch) => {
    dispatch({
      type: 'INITIATE_CHANGE_PASSWORD'
    })
    axios({
      method: 'post',
      url: `${baseUrl}ahits/rest/user/changepassword `,
      data
    })
      .then((response) => {
        // console.log("changing password ..... ", response.data)
        dispatch({
          type: 'CHANGE_PASSOWORD_SUCCESS',
          data: response,
          message: "Successfully changed password"
        })
      }).catch(error => {
        // console.log(error);
        dispatch({
          type: 'CHANGE_PASSWORD_FAILURE',
          message: error.message
        })
      });

  }
}