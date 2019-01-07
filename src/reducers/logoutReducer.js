let initialData = []
const initialState = {"data": initialData, "hasError": false, isAuthenticated: false}

export default function logout(state = initialState, action) {
  switch (action.type) {
    case 'LOGOUT_SUCCESS':
        // console.log(action)
        // return { data:action.data ,isAuthenticated : action.isAuthenticated}
        return { data:[] ,isAuthenticated : action.isAuthenticated}
   
    case 'GET_LOGGED_USER_SUCCESS':
      // return action.data
      // console.log(action)
      return Object.assign({}, state, action)
      
    case 'LOGOUT_FAILURE':
        break;

    default:
      return state
  }
}