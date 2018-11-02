let initialData = []
const initialState = {"data": initialData, "hasError": false, isAuthenticated: false}

export default function login(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      // console.log(action)
      // return { data:action.data ,isAuthenticated : action.isAuthenticated}
      return {data : [],isAuthenticated : action.isAuthenticated}
   
    case 'LOGIN_FAILURE':
      return {isAuthenticated:false}
      
    case 'GET_LOGGED_USER_SUCCESS':
      return Object.assign({}, state, action)

    case 'GET_LOGGED_USER_ERROR':
      return {isAuthenticated:false}

    default:
      return state
  }
}

