let initialData = []
const initialState = {"data": initialData, "hasError": false, isAuthenticated: false}

export default function login(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      console.log(action)
      return { data:action.data ,isAuthenticated : action.isAuthenticated}
    case 'LOGOUR_SUCCESS':
    case 'LOGIN_FAILURE':
    case 'LOGOUT_FAILURE':
    case 'GET_LOGGED_USER_SUCCESS':
      // return action.data
      // console.log(action)
      return Object.assign({}, state, action)
    default:
      return state
  }
}

