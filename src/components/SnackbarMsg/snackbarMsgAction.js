// export function successMessage(){
//     return (dispatch) => {
//     dispatch({
//         type:'SUCCESS_MESSAGE',
//         data:'Successfully submitted'
//     })
// }
// }

// export function errorMessage(){
//     return (dispatch) => {
//         dispatch({
//         type:'ERROR_MESSAGE',
//         data:'Failed to submit'
//     })
// }
// }

export function clearMessage(){
    return (dispatch) => {
        dispatch({
        type:'CLEAR_MESSAGE'
    })
}
}