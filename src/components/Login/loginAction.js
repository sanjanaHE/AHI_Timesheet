import axios from 'axios';


// export function login(data){
//   console.log("in login action ", data)
//       const newdata = {
//         username : data.username,
//         password :  data.password
//       }
//       return (dispatch) => {
//       axios.post('http://localhost:6090/ahits/login',{newdata}).then(response => {
//         console.log(response);
//            dispatch({
//           type: 'LOGIN_SUCCESS',
//           data: response.data
//         })
//     })
//   }
// }

export function getLoggedUser(){
    return (dispatch) => {
        axios.get('http://localhost:6090/ahits/rest/user/userdetails')
        .then(response => {
            // console.log("GET lOGGED USER ID" , response.data)
            dispatch({
                type : 'GET_LOGGED_USER_SUCCESS',
                data : response.data
            })
        })
    }
}





