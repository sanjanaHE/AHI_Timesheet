let initialData = []
const initialState = {"data": initialData, "hasError": false ,"pending" : false}

export default function changePasswordReducer(state = initialState, action) {
    // console.log("action",action)
    switch (action.type) {
        case 'INITIATE_CHANGE_PASSWORD' :
            return {...state, pending : false}
        case 'CHANGE_PASSOWORD_SUCCESS': 
            return { ...state, hasError: false, pending : true }
        case 'CHANGE_PASSWORD_FAILURE' :
            return {...state, message : action.message ,hasError:true, pending : true }
        default:
            return state

    }
}