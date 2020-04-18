import './index.scss'

import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import App from './app/App'
import Dashboard2 from './dashboard-2/Dashboard2'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/dashboard-2">
          <Dashboard2 />
        </Route>
        <Route exact path="/">
          <App />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
