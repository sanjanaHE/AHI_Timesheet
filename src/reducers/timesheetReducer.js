let initialData = []
  const initialState = {"data": initialData, "hasError": false}
function transformData(data){
  let transformData = {}
  let resp = []
  data.forEach(entry => {
    if (transformData.hasOwnProperty(entry.projectName + '|' + entry.taskName)){
      transformData[entry.projectName + '|' + entry.taskName][entry.date] = entry
    } else {
      let temp = {}
      temp[entry.date]=  entry
      transformData[entry.projectName + '|' + entry.taskName] = temp
    }
  });
  resp = Object.keys(transformData).map( ele => {
    let splitArray = ele.split('|')
    return {
      projectName: splitArray[0],
      taskName: splitArray[1],
      timesheetEnteries: transformData[ele]
    }
  })
  return resp
}
export default function timesheetReducer(state = initialState, action) {
    
    switch (action.type) {
    
    case 'GET_TIMESHEET_SUCCESS':
        console.log(transformData(action.data))
        return { data: transformData(action.data), hasError: false}
      
      default:
        return state
    }
  }