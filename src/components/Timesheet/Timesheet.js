import React, { Component } from 'react'
import Header from './../Header/Header';

class Timesheet extends Component {
  constructor(props){
      super(props)
  }
  render() {
    return (
        <React.Fragment>
            <Header></Header>  
            <div style={{margin : "2%"}}>
                <h1>Timesheet</h1>
                <form>
                    
                </form>
            </div>
        </React.Fragment>
    )
  }
}
export default Timesheet;
