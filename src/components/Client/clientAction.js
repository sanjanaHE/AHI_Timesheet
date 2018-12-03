import axios from 'axios';
import {baseUrl} from './../../contants';

export function addClient(formData) {
//   console.log("IN ADD CLIENT ",formData);
  let data = {
        "clientId": formData.clientId,
        "clientName": formData.clientName,
        "clientDesc": formData.clientDesc,
        "clientLocation": formData.clientLocation
    } 
    // console.log("ADD PROJECT DATA" , data)
    // TODO: MAKE AN API CALL TO BACKEND SERVER
    return (dispatch) => {
      axios({
        method: 'post',
        url: `${baseUrl}ahits/api/clients/`,
        data
      })
        .then((response) => {
          // console.log("adding project ..... ", response.data)
          getClientsApi(dispatch)
        });
        
    }
}


function getClientsApi(dispatch){
  axios({
    method: 'get',
    url: `${baseUrl}ahits/api/clients/all`
  })
    .then((response) => {
    //   console.log("getting clients ", response.data)
      dispatch({
        type: 'GET_CLIENT_SUCCESS',
        data: response.data
      })
    });
}
export function getClients() {
  return (dispatch) => {
    getClientsApi(dispatch)
  }
}



// export function deleteClient(id){
//   return (dispatch) => {
//   axios({
//     method: 'get',
//     url: `${baseUrl}ahits/api/clients/delete?projectIds=${id}`,
//   })
//     .then((response) => {
//       console.log("deleting client ", response.data)
//       getClientsApi(dispatch)
//     });
//   }
// }

