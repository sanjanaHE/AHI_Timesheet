let initialData = []
const initialState = {"data": initialData, "hasError": false}

export default function login(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'LOGIN_SUCCESS':
    case 'LOGIN_FAILURE':
    case 'LOGOUT_REQUESTv':
    case 'LOGOUT_SUCCESS':
    case 'GET_LOGGED_USER_SUCCESS':
      // return action.data
      console.log(action)
      return Object.assign({}, state, action)
    default:
      return state
  }
}

