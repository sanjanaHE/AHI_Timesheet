
export default function snackbarMsgReducer(state = [], action) {
    switch (action.type) {
        case 'SUCCESS_MESSAGE':
        case 'FAILURE_MESSAGE':
        case 'ADD_MESSAGE':
            return [...state, action.data]
        case 'CLEAR_MESSAGE':
            return []
        default:
          return state
    }
}