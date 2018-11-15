let initialData = []
const initialState = {"data": initialData, "hasError": false, isAuthenticated: false, dataFetched: false}
// dataFetched is a flag used to show loading until data fetchedvfrom backend
export default function login(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {data : [],isAuthenticated : action.isAuthenticated, "hasError": false}
   
    case 'LOGIN_FAILURE':
      return {isAuthenticated:false ,"hasError": true}
      
    case 'GET_LOGGED_USER_SUCCESS':
      return {data: action.data, dataFetched: true}

    case 'GET_LOGGED_USER_ERROR':
      return {isAuthenticated:false, dataFetched: true}

    default:
      return state
  }
}

