import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from 'react-redux';
import store from './store/store';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import UnauthorizedRoute  from '../src/route/UnauthorisedRoute';
import AuthorisedRoute  from '../src/route/AuthorisedRoute';
import { HashRouter,Switch, Route, Link,Redirect  } from 'react-router-dom';



const theme = createMuiTheme({
    palette: {
      type: 'light',
      primary: {
        // light: will be calculated from palette.primary.main,
        main: '#000000',
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
    },
    typography: {
        // Use the system font instead of the default Roboto font.
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
      },
  });
ReactDOM.render(
          <Provider store = {store}>  
            <MuiThemeProvider theme={theme}>
              <HashRouter basename = "/ahits">
                <div className="App">
                  <Switch>
                    <Route path="/" component={UnauthorizedRoute} />
                    <Route path="/auth" component={UnauthorizedRoute} />
                    <AuthorisedRoute path="/app" component={App} />
                  </Switch>
              </div>
            </HashRouter>
       </MuiThemeProvider>
     </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
