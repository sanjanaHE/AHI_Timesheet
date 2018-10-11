
// T
// based on a token being in local storage. In a real app,he auth reducer. The starting state sets authentication
// we would also want a util to check if the token is expired.
const login = (state = {}, action) => {
    
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'LOGIN_SUCCESS':
    case 'LOGIN_FAILURE':
    case 'LOGOUT_REQUESTv':
    case 'LOGOUT_SUCCESS':
      return Object.assign({}, state, action)

    default:
      return state
  }
}

export default login

