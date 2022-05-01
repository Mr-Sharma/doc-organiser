
import React, { Component } from "react";
import "./App.css";
// import LoginPage from "./components/login";
// import AdminDashboard from "./admin";
// import OperatorDashboard from "./operator";
import CompanyDashboard from "./company";
import CompanyLoginPage from "./components/companyLogin";
import {BrowserRouter as Router, Route,Routes} from "react-router-dom";


class App extends Component {
  render() {
    return (
      <Router>
          <Routes>
            {/* <Route exact path="/" element={<StudentDashboard/>} /> */}
            {/* <Route exact path="/" element={<LoginPage/>} />
            <Route exact path="login" element={<LoginPage/>} />
            <Route exact path="admin/*" element={<AdminDashboard/>} />
            <Route exact path="operator/*" element={<OperatorDashboard/>} /> 
            <Route path="*" element={<h1>Page not Found!!!</h1>} />*/}
            <Route exact path="/" element={<CompanyLoginPage/>} />
            <Route exact path="/login" element={<CompanyLoginPage/>} />
            <Route exact path="/company/*" element={<CompanyDashboard/>} />
            <Route path="*" element={<h1>Page not Found!!!</h1>} />
          </Routes>
      </Router>
    );
  }
}

export default App;
