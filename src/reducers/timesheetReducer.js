import uuid from "uuid";
let initialData = []

const initialState = { "data": initialData, "hasError": false }
function transformData(data) {
  let transformData = {}
  let resp = []
  data.forEach(entry => {
    // console.log(entry)
    if (transformData.hasOwnProperty(entry.projectName + '|' + entry.taskName)) {
      transformData[entry.projectName + '|' + entry.taskName][entry.date] = entry
    } else {
      let temp = {}
      temp[entry.date] = entry
      // console.log("temp",temp)
      transformData[entry.projectName + '|' + entry.taskName] = temp
      // console.log("trans data",transformData);
    }
  });
  let counter = 0
  resp = Object.keys(transformData).map(ele => {
    let rowId = uuid.v4()
    let splitArray = ele.split('|')
    return {
      isRowDeletable: false,
      rowId: rowId,
      projectName: splitArray[0],
      taskName: splitArray[1],
      timesheetEnteries: transformData[ele]
    }
  })
  // console.log("resp ",resp)
  return resp
}
export default function timesheetReducer(state = initialState, action) {

  switch (action.type) {

    case 'GET_TIMESHEET_SUCCESS':
      // console.log("action.data",action.data)
      console.log("transformData", transformData(action.data))
      return { data: transformData(action.data), hasError: false }

    default:
      return state
  }
}