
import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route,Routes} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
          <Routes>
            <Route exact path="/" element={<h1>Hello, world!</h1>} />
            <Route exact path="/login" element={<h1>Login</h1>} />
            <Route exact path="/:section" component={<h1>Dashboard</h1>} />
            <Route exact path="/user/:section" component={<h1>userDashboard</h1>} />                    
          </Routes>
      </Router>
    );
  }
}

export default App;
