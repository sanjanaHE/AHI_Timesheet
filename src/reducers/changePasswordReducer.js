let initialData = []
const initialState = {"data": initialData, "hasError": null ,"pending" : false}

export default function changePasswordReducer(state = initialState, action) {
    // console.log("action",action)
    switch (action.type) {
        case 'INITIATE_CHANGE_PASSWORD' :
            return {...state, hasError: false , pending : true}
        case 'CHANGE_PASSOWORD_SUCCESS': 
            return { ...state, hasError: false, pending : false }
        case 'CHANGE_PASSWORD_FAILURE' :
            return {...state, message : action.message ,hasError:true, pending : false }
        case 'RESET_CHANGE_PASSWORD' : 
            return initialState
        default:
            return state

    }
}