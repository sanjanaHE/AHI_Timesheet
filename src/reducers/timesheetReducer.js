import uuid from "uuid";
let initialData = []

const initialState = { "data": initialData, "hasError": false }
function transformData(data) {
  let transformData = {}
  let resp = []
  data.forEach(entry => {
    // console.log(entry)
    let refactoredEntry = {
      date:entry.date,
      id:entry.id,
      empId:entry.empId,
      projectId:entry.projectId,
      taskId:entry.taskId,
      taskDesc:entry.taskDesc, //add this for taskDesc field
      totalHours:parseInt(entry.totalHours),
      rowId:entry.rowId
    }
    const timesheetKey = entry.projectId + '|' + entry.taskId + '|' + entry.taskDesc;
    if (transformData.hasOwnProperty(timesheetKey)) {
      transformData[timesheetKey][entry.date] = refactoredEntry
    } else {
      let temp = {}
      temp[entry.date] = refactoredEntry //for each entry date add json object // 2018-11-26:{date:'',id:'',empId:'',projectId:''...}
      // console.log("temp",temp)
      transformData[timesheetKey] = temp //'entry.projectId + '|' + entry.taskId'=temp
      // console.log("trans data",transformData);
    }
  });
  let counter = 0
  console.log("transformed data",transformData)
  resp = Object.keys(transformData).map(ele => {
    let rowId = uuid.v4()
    let splitArray = ele.split('|')
    return {
      isRowDeletable: false,
      rowId: rowId,
      taskDesc: splitArray[2],
      projectId: parseInt(splitArray[0]),
      taskId: parseInt(splitArray[1]),
      timesheetEnteries: transformData[ele]
    }
  })
  console.log("resp ",resp)
  return resp
}
export default function timesheetReducer(state = initialState, action) {

  switch (action.type) {

    case 'GET_TIMESHEET_SUCCESS':
      // console.log("action.data",action.data)
      // console.log("transformData", transformData(action.data))
      return { data: transformData(action.data), hasError: false }

    default:
      return state
  }
}