import React, { Component } from 'react';
import { 
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect 
} from 'react-router-dom';
import './style/materialdesignicons.css';
import './App.css';

//Components
import Callback from './components/callback';
import Home from './components/home';

// Admin Components
import AdminDashboard from './components/admin/dashboard';
import AdminDrivers from './components/admin/drivers';
import AdminDriversReports from './components/admin/driverReport';
import AdminAddDriver from './components/admin/addDriver';
import AdminEditDriver from './components/admin/editDriver';

// Driver Components
import Dashboard from './components/admin/dashboard';
import { SnackbarProvider } from 'notistack';


//  App Routes
class App extends Component {
  render() {
    return (
      <div className="App">
        <SnackbarProvider maxSnack={3}>
          <Router>
            <Switch>
              <Route
                exact
                path="/"
                component={Home}
              />
              <Route
                exact
                path="/home"
                component={Home}
              />
              <Route
                exact
                path="/callback"
                component={Callback}
              />
              <Route
                exact
                path="/admin/dashboard"
                component={AdminDashboard}
              />
              <Route
                exact
                path="/admin/drivers"
                component={AdminDrivers}
              />
              <Route
                exact
                path="/admin/drivers/add"
                component={AdminAddDriver}
              />
              <Route
                exact
                path="/admin/drivers/edit/:id"
                component={AdminEditDriver}
              />
              <Route
                exact
                path="/admin/drivers-report"
                component={AdminDriversReports}
              />
            </Switch>
          </Router>
        </SnackbarProvider>
      </div>
    );
  }
}

export default App;
