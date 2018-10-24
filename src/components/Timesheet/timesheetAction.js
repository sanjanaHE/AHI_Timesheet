import axios from 'axios';
import {baseUrl} from './../../contants';

export function getTimesheetEntries(empId,fromDate,toDate){
    return (dispatch) => {
    axios({
      method: 'get',
      url: `${baseUrl}ahits/api/timesheet/fetchData/${empId}?fromDate=${fromDate}&toDate=${toDate}`
    })
      .then((response) => {
        // console.log("getting users ", response.data)
        dispatch({
          type: 'GET_TIMESHEET_SUCCESS',
          data: response.data
        })
      });
    }
  }

export function saveTimesheetEntries(timesheet){
  return (dispatch) => {
    console.log('In Save Method', timesheet)
    let entries = []
    timesheet.forEach(element => {
      let dates = Object.keys(element.timesheetEnteries)
      for (let i =0; i<dates.length; i++){
        entries.push(element.timesheetEnteries[dates[i]])
      }
    console.log('Save Method', entries)    
  });
    axios({
      method: 'post',
      url: `${baseUrl}ahits/api/timesheet/`,
      data: entries
    })
      
  }
}